import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { CareNotesList } from "@/components/customComponents/CareNotesList";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { initDB } from "@/lib/db";
import { syncWithServer } from "@/store/careNotesSlice";
import { AddNoteForm } from "./components/customComponents/AddNoteForm";

const App = () => {
  const [selectedResident, setSelectedResident] = useState<string>("all");
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  console.log("DB isInitialized:", isInitialized);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      // Set up background sync every 5 minutes
      const syncInterval = setInterval(() => {
        console.log("Syncing with server...");
        store.dispatch(syncWithServer());
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(syncInterval);
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Initializing application...</p>
      </div>
    );
  }

  return (
    <Provider store={store}>
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
            <Select
              value={selectedResident}
              onValueChange={setSelectedResident}
            >
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
          {!showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-green-500 hover:bg-green-600"
            >
              + Add Note
            </Button>
          )}
        </div>

        {showAddForm ? (
          <div className="mb-6">
            <AddNoteForm onCancel={() => setShowAddForm(false)} />
          </div>
        ) : (
          <CareNotesList residentFilter={selectedResident} />
        )}
        <Toaster />
      </div>
    </Provider>
  );
};

export default App;
