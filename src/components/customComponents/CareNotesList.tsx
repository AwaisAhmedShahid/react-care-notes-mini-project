import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

import { CareNote } from "@/types";
import { fetchCareNotes } from "@/lib/api";
import { useEffect, useState } from "react";

export function CareNotesList() {
  const [careNotes, setCareNotes] = useState<CareNote[]>([]);
  console.log("🚀 ~ App ~ careNotes:", careNotes);
  // fetchCareNotes

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await fetchCareNotes();
        setCareNotes(notes);
      } catch (error) {
        console.error("Error fetching care notes:", error);
      }
    };

    fetchNotes();
  }, []);

  if (careNotes === undefined || careNotes.length === 0) {
    return <div className="flex justify-center p-4">Loading care notes...</div>;
  }

  return (
    <div className="space-y-4">
      {careNotes.map((note) => (
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
