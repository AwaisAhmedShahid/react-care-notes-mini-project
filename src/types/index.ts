export interface CareNote {
  id: number;
  residentName: string;
  dateTime: string;
  content: string;
  authorName: string;
  synced?: boolean;
}