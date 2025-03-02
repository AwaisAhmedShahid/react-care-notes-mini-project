import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchNotes } from "@/store/careNotesSlice";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { Pagination } from '@/components/ui/pagination';

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
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p>Loading care notes...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-red-500 p-4 flex flex-col items-center">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>Error: {error}</p>
      </div>
    );
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
      {status === "loading" && notes.length > 0 && (
        <div className="bg-blue-100 text-blue-800 p-3 rounded-md flex items-center mb-4">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Syncing data...</span>
        </div>
      )}
      {filteredNotes.map((note) => (
        <Card key={note.id} className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{note.residentName}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(note.dateTime), "yyyy-MM-dd h:mm a")} -{" "}
                  {note.authorName}
                </p>
              </div>
              <Badge
                variant={note.synced ? "outline" : "secondary"}
                className="ml-2"
              >
                {note.synced ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" /> Synced
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" /> Local
                  </>
                )}
              </Badge>
            </div>
            <p className="mt-2">{note.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
