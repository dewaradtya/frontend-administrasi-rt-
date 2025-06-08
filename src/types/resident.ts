import type { House } from "./house";

export type ResidentStatus = "kontrak" | "tetap";

export interface Resident {
  id: number;
  name: string;
  ktp_photo: File | null;
  status: ResidentStatus;
  phone: string;
  is_married: boolean;
  house_id?: number | null;
  house?: House;
  start_date?: string | null;
}
