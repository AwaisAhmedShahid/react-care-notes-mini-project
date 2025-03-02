import { openDB, DBSchema, IDBPDatabase } from "idb";

interface CareNote {
  id: number;
  residentName: string;
  dateTime: string;
  content: string;
  authorName: string;
  synced?: boolean;
}

interface CareNotesDB extends DBSchema {
  careNotes: {
    key: number;
    value: CareNote;
    indexes: {
      "by-date": string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<CareNotesDB>> | null = null;

export const initDB = async (): Promise<IDBPDatabase<CareNotesDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<CareNotesDB>("care-notes-db", 1, {
      upgrade(db) {
        // Check if store already exists to prevent errors on re-initialization
        if (!db.objectStoreNames.contains("careNotes")) {
          const careNotesStore = db.createObjectStore("careNotes", {
            keyPath: "id",
            autoIncrement: true,
          });
          careNotesStore.createIndex("by-date", "dateTime");
        }
      },
    });
  }
  return dbPromise;
};

export const getAllNotes = async (): Promise<CareNote[]> => {
  try {
    const db = await initDB();
    return db.getAllFromIndex("careNotes", "by-date");
  } catch (error) {
    console.error(
      "Error getting all notes:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return [];
  }
};

export const getRecentNotes = async (limit = 5): Promise<CareNote[]> => {
  try {
    const db = await initDB();
    const tx = db.transaction("careNotes", "readonly");
    const index = tx.store.index("by-date");

    // Get all notes and sort them by date (newest first)
    const allNotes = await index.getAll();
    return allNotes
      .sort(
        (a, b) =>
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      )
      .slice(0, limit);
  } catch (error) {
    console.error(
      "Error getting recent notes:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return [];
  }
};

export const addNote = async (note: Omit<CareNote, "id">): Promise<number> => {
  try {
    const db = await initDB();
    const newNote = { ...note, synced: false };
    return db.add("careNotes", newNote as CareNote);
  } catch (error) {
    console.error(
      "Error adding note:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
};

export const updateNote = async (note: CareNote): Promise<number> => {
  try {
    const db = await initDB();
    await db.put("careNotes", note);
    return note.id;
  } catch (error) {
    console.error(
      "Error updating note:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
};

export const markNotesAsSynced = async (ids: number[]): Promise<void> => {
  try {
    const db = await initDB();
    const tx = db.transaction("careNotes", "readwrite");

    for (const id of ids) {
      const note = await tx.store.get(id);
      if (note) {
        await tx.store.put({ ...note, synced: true });
      }
    }

    await tx.done;
  } catch (error) {
    console.error(
      "Error marking notes as synced:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const getUnsyncedNotes = async (): Promise<CareNote[]> => {
  try {
    const db = await initDB();
    const allNotes = await db.getAll("careNotes");
    return allNotes.filter((note) => !note.synced);
  } catch (error) {
    console.error(
      "Error getting unsynced notes:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return [];
  }
};
