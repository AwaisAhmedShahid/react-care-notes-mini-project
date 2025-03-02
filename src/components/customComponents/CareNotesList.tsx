import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchNotes } from "@/store/careNotesSlice";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface CareNotesListProps {
  residentFilter?: string;
}

export function CareNotesList({ residentFilter = "all" }: CareNotesListProps) {
  const dispatch = useAppDispatch();
  const { notes, status, error } = useAppSelector((state) => state.careNotes);

  useEffect(() => {
    dispatch(fetchNotes());

    // Set up polling every 60 seconds
    const intervalId = setInterval(() => {
      dispatch(fetchNotes());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (status === "loading" && notes.length === 0) {
    return <div className="flex justify-center p-4">Loading care notes...</div>;
  }

  if (status === "failed") {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  // Filter notes based on selected resident
  const filteredNotes =
    residentFilter === "all"
      ? notes
      : notes.filter((note) => note.residentName === residentFilter);

  if (filteredNotes.length === 0) {
    return <div className="text-center p-4">No care notes found.</div>;
  }

  return (
    <div className="space-y-4">
      {filteredNotes.map((note) => (
        <Card key={note.id} className="shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold">{note.residentName}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(note.dateTime), "yyyy-MM-dd h:mm a")} -{" "}
              {note.authorName}
            </p>
            <p className="mt-2">{note.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
