import api from "../lib/axios";
import type { InhabitantHistories } from "../types/inhabitantHistories";

export async function getInhabitantHistoriess(): Promise<InhabitantHistories[]> {
  const res = await api.get("/inhabitant-histories");
  return res.data;
}

export async function getInhabitantHistories(id: number): Promise<InhabitantHistories> {
  const res = await api.get(`/inhabitant-histories/${id}`);
  return res.data.data;
}

export async function createInhabitantHistories(data: FormData | Partial<InhabitantHistories>) {
  return await api.post("/inhabitant-histories", data);
}

export async function updateInhabitantHistories(id: number, data: Partial<InhabitantHistories>) {
  console.log("Data dikirim ke API update:", data);
  return await api.put(`/inhabitant-histories/${id}`, data);
}


export async function getInhabitantHistoriesById(id: number) {
  const response = await api.get(`/inhabitant-histories/${id}`);
  return response.data;
}

export async function deleteInhabitantHistories(id: number) {
  return await api.delete(`/inhabitant-histories/${id}`);
}
