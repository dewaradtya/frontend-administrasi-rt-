import type { House } from "./house";
import type { Resident } from "./resident";

export interface Payment {
  id: number;
  resident_id: number;
  resident: Resident;
  house_id: number;
  house: House;
  total_amount: number;
  note: string;
  status: "Lunas" | "Belum Lunas";
  payment_date: string;
}

export interface PaymentItem {
  id: number;
  type: "satpam" | "kebersihan";
  amount: number;
  start_date: string;
  end_date: string | null;
}