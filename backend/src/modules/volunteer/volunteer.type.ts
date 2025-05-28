export interface VolunteerType {
  id: string;
  nik: string;
  full_name: string;
  address: string | null;
  age: number | null;
  email: string;
  phone: string | null;
  url_photo: string | null;
  created_at: Date;
  updated_at: Date | null;
  status: string;
}