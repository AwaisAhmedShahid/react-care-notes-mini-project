import { useState } from "react";
import { CareNotesList } from "./components/customComponents/CareNotesList";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const App = () => {
  const [selectedResident, setSelectedResident] = useState<string>("all");

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-3">
      <header className="flex flex-col justify-between items-center mb-6 gap-3">
        <h1 className="text-4xl font-bold">Care Notes</h1>
        <div className="flex flex-col items-center">
          <label
            htmlFor="filter by resident"
            className="mr-2 text-muted-foreground text-sm"
          >
            filter by resident
          </label>
          <Select value={selectedResident} onValueChange={setSelectedResident}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Resident" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Residents</SelectItem>
              <SelectItem value="Nurse Smith">Nurse Smith</SelectItem>
              <SelectItem value="Dr. Brown">Dr. Brown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="mb-4">
        <Button onClick={() => {}} className="bg-green-500 hover:bg-green-600">
          + Add Note
        </Button>
      </div>

      <CareNotesList />
    </div>
  );
};

export default App;
