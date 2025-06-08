import api from "../lib/axios";
import type { Expense } from "../types/expense";

export async function getExpenses(): Promise<Expense[]> {
  const res = await api.get("/expenses");
  return res.data;
}

export async function getExpense(id: number): Promise<Expense> {
  const res = await api.get(`/expenses/${id}`);
  return res.data.data;
}

export async function createExpense(data: FormData | Partial<Expense>) {
  return await api.post("/expenses", data);
}

export async function updateExpense(id: number, data: FormData | Partial<Expense>) {
  return await api.put(`/expenses/${id}`, data);
}

export async function getExpenseById(id: number) {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
}

export async function deleteExpense(id: number) {
  return await api.delete(`/expenses/${id}`);
}
