import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

const careNotes = [
  {
    id: 1,
    residentName: "Alice Johnson",
    dateTime: "2024-09-17T10:30:00Z",
    content: "Medication administered as scheduled.",
    authorName: "Nurse Smith",
  },
  {
    id: 2,
    residentName: "Bob Williams",
    dateTime: "2024-09-17T11:45:00Z",
    content: "Assisted with physical therapy exercises.",
    authorName: "Dr. Brown",
  },
];

export function CareNotesList() {
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
