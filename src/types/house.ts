import type { Payment } from "./payment";

export interface House {
  id: number;
  house_number: string;
  is_occupied: boolean;
  payments: Payment[];
}