import api from "../lib/axios";
import type { House } from "../types/house";

export async function getHouses(): Promise<House[]> {
  const res = await api.get("/houses");
  return res.data;
}

export async function getHouse(id: number): Promise<House> {
  const res = await api.get(`/houses/${id}`);
  return res.data;
}

export async function createHouse(data: FormData | Partial<House>) {
  return await api.post("/houses", data);
}

export async function updateHouse(id: number, data: Omit<House, "id">) {
  const response = await api.put(`/houses/${id}`, data);
  return response.data;
}

export async function getHouseById(id: number) {
  const response = await api.get(`/houses/${id}`);
  return response.data;
}

export async function deleteHouse(id: number) {
  return await api.delete(`/houses/${id}`);
}
