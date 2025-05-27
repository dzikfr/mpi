export interface AssetType {
  id: string;
  name: string;
  type: string | null;
  description: string | null;
  quantity: number | null;
  available_quantity: number | null;
  notes: string | null;
  photo_url: string | null;
  status: string;
  created_at: Date;
  updated_at: Date | null;
}