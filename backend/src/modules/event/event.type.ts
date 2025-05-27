export interface EventType {
  id: string;
  name: string;
  description: string | null;
  notes: string | null;
  date_start: Date | null;
  date_end: Date | null;
  photo_url: string | null;
  created_at: Date;
  updated_at: Date | null;
  status: string;
}