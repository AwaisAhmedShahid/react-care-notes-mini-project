import { configureStore } from "@reduxjs/toolkit";
import careNotesReducer from "./careNotesSlice";

export const store = configureStore({
  reducer: {
    careNotes: careNotesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
