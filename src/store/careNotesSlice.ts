import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CareNote } from "@/types";
import * as api from "@/lib/api";
import * as db from "@/lib/db";

interface CareNotesState {
  notes: CareNote[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CareNotesState = {
  notes: [],
  status: "idle",
  error: null,
};

// Async thunks
export const fetchNotes = createAsyncThunk("careNotes/fetchNotes", async () => {
  // First try to fetch from API
  try {
    const apiNotes = await api.fetchCareNotes();

    // Store fetched notes in the local database
    if (apiNotes.length > 0) {
      try {
        const database = await db.initDB();
        const tx = database.transaction("careNotes", "readwrite");

        for (const note of apiNotes) {
          await tx.store.put({ ...note, synced: true });
        }

        await tx.done;
      } catch (dbError) {
        console.error(
          "Error updating local database:",
          dbError instanceof Error ? dbError.message : "Unknown error"
        );
      }
    }
  } catch (error) {
    console.error(
      "Error syncing with API:",
      error instanceof Error ? error.message : "Unknown error"
    );
    // Continue with local data if API fails
  }

  // Get recent notes from local DB
  return await db.getRecentNotes(5);
});

export const addNote = createAsyncThunk(
  "careNotes/addNote",
  async (note: Omit<CareNote, "id">) => {
    // Add to local DB first
    const id = await db.addNote(note);

    // Try to sync with API
    try {
      const apiNote = await api.createCareNote(note);

      if (apiNote) {
        // Update local note with server data and mark as synced
        await db.updateNote({ ...apiNote, synced: true });
        return apiNote;
      }
    } catch (error) {
      console.error(
        "Error syncing new note with API:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }

    // Return the local note if API sync fails
    const allNotes = await db.getAllNotes();
    return allNotes.find((n) => n.id === id);
  }
);

export const syncWithServer = createAsyncThunk(
  "careNotes/syncWithServer",
  async () => {
    try {
      // Get unsynced notes
      const unsyncedNotes = await db.getUnsyncedNotes();

      // Try to sync each note
      const syncedIds: number[] = [];

      for (const note of unsyncedNotes) {
        try {
          const { id, ...noteData } = note;
          const apiNote = await api.createCareNote(noteData);

          if (apiNote) {
            console.log("🚀 ~ synced note with id:", id);
            syncedIds.push(note.id);
          }
        } catch (error) {
          console.error(
            `Error syncing note ${note.id}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      }

      // Mark successfully synced notes
      if (syncedIds.length > 0) {
        await db.markNotesAsSynced(syncedIds);
      }

      // Return recent notes
      return await db.getRecentNotes(5);
    } catch (error) {
      console.error(
        "Error during server sync:",
        error instanceof Error ? error.message : "Unknown error"
      );
      // Return current notes if sync fails
      return await db.getRecentNotes(5);
    }
  }
);

const careNotesSlice = createSlice({
  name: "careNotes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchNotes.fulfilled,
        (state, action: PayloadAction<CareNote[]>) => {
          state.status = "succeeded";
          state.notes = action.payload;
        }
      )
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch notes";
      })

      // Add note
      .addCase(addNote.fulfilled, (state, action) => {
        if (action.payload) {
          // Add the new note and keep only the 5 most recent
          const allNotes = [action.payload, ...state.notes];
          state.notes = allNotes
            .sort(
              (a, b) =>
                new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
            )
            .slice(0, 5);
        }
      })

      // Sync with server
      .addCase(syncWithServer.fulfilled, (state, action) => {
        state.notes = action.payload;
      });
  },
});

export default careNotesSlice.reducer;
