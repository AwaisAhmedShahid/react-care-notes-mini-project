import { CareNote } from "@/types";

const API_URL = "http://localhost:3001/api/v1";

export const fetchCareNotes = async (): Promise<CareNote[]> => {
  try {
    // Check if the server is available
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_URL}/care-notes`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Error fetching care notes:",
      error instanceof Error ? error.message : "Unknown error"
    );
    // Return empty array instead of throwing to handle offline gracefully
    return [];
  }
};

export const createCareNote = async (
  note: Omit<CareNote, "id">
): Promise<CareNote | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_URL}/care-notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Error creating care note:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
};
