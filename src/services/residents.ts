import type { Resident } from "../types/resident";
import api from "../lib/axios";

export async function getResidents(): Promise<Resident[]> {
  const res = await api.get("/residents");
  return res.data;
}

export async function getResident(id: number): Promise<Resident> {
  const res = await api.get(`/residents/${id}`);
  return res.data.data;
}

export async function getActiveResidents(): Promise<Resident[]> {
  const res = await api.get("/active-residents");
  return res.data;
}

export async function createResident(data: FormData) {
  return await api.post("/residents", data);
}

export async function updateResident(id: number, data: FormData | Partial<Resident>) {
  return await api.post(`/residents/${id}?_method=PUT`, data);
}

export async function getResidentById(id: number) {
  const response = await api.get(`/residents/${id}`);
  return response.data;
}

export async function deleteResident(id: number) {
  return await api.delete(`/residents/${id}`);
}
