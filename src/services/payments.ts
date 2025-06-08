import api from "../lib/axios";
import type { Payment } from "../types/payment";

export async function getPayments(): Promise<Payment[]> {
  const res = await api.get("/payments");
  return res.data;
}

export async function getPayment(id: number): Promise<Payment> {
  const res = await api.get(`/payments/${id}`);
  return res.data.data;
}

export async function createPayment(data: FormData | Partial<Payment>) {
  return await api.post("/payments", data);
}

export async function updatePayment(id: number, data: FormData | Partial<Payment>) {
  return await api.put(`/payments/${id}`, data);
}

export async function getPaymentById(id: number) {
  const response = await api.get(`/payments/${id}`);
  return response.data;
}

export async function deletePayment(id: number) {
  return await api.delete(`/payments/${id}`);
}
