import { Router } from "express";

const router = Router();

// In-memory database for care notes data could use an actual database
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

// GET /care-notes - Get all care notes
router.get("/care-notes", (_, res) => {
  // TODO: Server side pagination and filtering
  // Sort by date (newest first)
  const sortedNotes = [...careNotes].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  res.status(200).json(sortedNotes);
});

// POST /care-notes - Create a new care note
router.post("/care-notes", (req, res) => {
  const { residentName, dateTime, content, authorName } = req.body;

  // TODO: Create validation middleware
  // Validate required fields
  if (!residentName || !dateTime || !content || !authorName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Create new note
  const newNote = {
    id: careNotes.length + 1,
    residentName,
    dateTime,
    content,
    authorName,
  };

  // Add to database
  careNotes.push(newNote);

  res.status(201).json(newNote);
});

export default router;
