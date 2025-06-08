import type { House } from "./house";
import type { Resident } from "./resident";

export interface InhabitantHistories {
  id: number;
  resident_id: number;
  resident: Resident;
  house_id: number;
  house: House;
  start_date: string;
  end_date: string | null;
}