import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextInput from "../../../components/forms/textInput";
import {
  getInhabitantHistoriesById,
  updateInhabitantHistories,
} from "../../../services/inhabitantHistories";
import SelectInput from "../../../components/forms/selectInput";
import type { Resident } from "../../../types/resident";
import type { House } from "../../../types/house";
import type { InhabitantHistories } from "../../../types/inhabitantHistories";
import { getResidents } from "../../../services/residents";
import { getHouses } from "../../../services/houses";
import ErrorMessage from "../../../components/forms/errorMessage";

export default function EditInhabitantHistoriesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<
    Omit<InhabitantHistories, "id" | "resident" | "house">
  >({
    resident_id: 0,
    house_id: 0,
    start_date: "",
    end_date: "",
  });
  const [residents, setResidents] = useState<Resident[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInhabitantHistoriesById(Number(id));
        setForm({
          resident_id: data.resident_id ?? 0,
          house_id: data.house_id ?? 0,
          start_date: data.start_date ?? "",
          end_date: data.end_date ?? "",
        });

        const [residentRes, houseRes] = await Promise.all([
          getResidents(),
          getHouses(),
        ]);
        setResidents(residentRes);
        setHouses(houseRes);
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data");
        navigate("/houses");
      }
    };

    if (id) fetchData();
  }, [id, navigate]);

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.resident_id) newErrors.resident_id = "Penghuni wajib dipilih";
    if (!form.house_id) newErrors.house_id = "Rumah wajib dipilih";
    if (!form.start_date) newErrors.start_date = "Tanggal masuk wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["resident_id", "house_id"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!validate()) return;

    const payload = {
      ...form,
      end_date: form.end_date === "" ? null : form.end_date,
    };

    try {
      await updateInhabitantHistories(Number(id), payload);
      alert("Data riwayat penghuni berhasil diperbarui");
      navigate("/houses");
    } catch (err: any) {
      console.error("Gagal update:", err.response?.data || err);
      alert("Gagal memperbarui riwayat penghuni");
    }
  };

  return (
    <div className="max-w-xl p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Edit Riwayat Penghuni
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Penghuni
          </label>
          <SelectInput
            name="resident_id"
            value={form.resident_id}
            onChange={handleChange}
            options={residents.map((resident) => ({
              label: resident.name,
              value: resident.id,
            }))}
          />
          <ErrorMessage message={errors.resident_id} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rumah
          </label>
          <SelectInput
            name="house_id"
            value={form.house_id}
            onChange={handleChange}
            options={houses.map((house) => ({
              label: house.house_number,
              value: house.id,
            }))}
            readOnly={true}
          />
          <ErrorMessage message={errors.house_id} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Masuk
          </label>
          <TextInput
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
          />
          <ErrorMessage message={errors.start_date} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Keluar
          </label>
          <TextInput
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
