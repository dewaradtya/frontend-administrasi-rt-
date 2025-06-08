import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResident } from "../../services/residents";
import { getHouses } from "../../services/houses";
import type { Resident } from "../../types/resident";
import type { House } from "../../types/house";
import TextInput from "../../components/forms/textInput";
import SelectInput from "../../components/forms/selectInput";
import CheckboxInput from "../../components/forms/checkboxInput";
import ErrorMessage from "../../components/forms/errorMessage";

export default function CreateResidentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<
    Omit<Resident, "ktp_photo"> & { ktp_photo_file?: File | null }
  >({
    name: "",
    status: "tetap",
    phone: "",
    is_married: false,
    house_id: null,
    ktp_photo_file: null,
  });
  const [houses, setHouses] = useState<House[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getHouses().then(setHouses);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value, checked, files } = e.target;

    if (name === "ktp_photo_file" && files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, ktp_photo_file: file }));
      setPreview(URL.createObjectURL(file));
    } else if (name === "house_id") {
      setForm((prev) => ({
        ...prev,
        house_id: value ? parseInt(value, 10) : null,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!form.phone.trim()) newErrors.phone = "Nomor telepon wajib diisi";
    if (!form.ktp_photo_file)
      newErrors.ktp_photo_file = "Foto KTP wajib diunggah";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("status", form.status);
      formData.append("phone", form.phone);
      formData.append("is_married", form.is_married ? "1" : "0");

      if (form.house_id !== null) {
        formData.append("house_id", String(form.house_id));
      }

      if (form.ktp_photo_file) {
        formData.append("ktp_photo", form.ktp_photo_file);
      }

      await createResident(formData);
      alert("Penghuni berhasil ditambahkan");
      navigate("/residents");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan penghuni");
    }
  };

  return (
    <div className="max-w-xl p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Tambah Penghuni</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        encType="multipart/form-data"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <TextInput
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama Lengkap"
          />
          <ErrorMessage message={errors.name} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto KTP
          </label>
          <input
            type="file"
            name="ktp_photo_file"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <ErrorMessage message={errors.ktp_photo_file} />
          {preview && (
            <img
              src={preview}
              alt="Preview Foto KTP"
              className="mt-2 max-h-48 object-contain rounded-md"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <SelectInput
            name="status"
            value={form.status}
            onChange={handleChange}
            options={[
              { label: "Tetap", value: "tetap" },
              { label: "Kontrak", value: "kontrak" },
            ]}
          />
          <ErrorMessage message={errors.status} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Telepon
          </label>
          <TextInput
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Nomor Telepon"
          />
          <ErrorMessage message={errors.phone} />
        </div>

        <div>
          <CheckboxInput
            name="is_married"
            checked={form.is_married}
            onChange={handleChange}
            label="Sudah Menikah"
          />
          <ErrorMessage message={errors.is_married} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Rumah
          </label>
          <SelectInput
            name="house_id"
            value={form.house_id ?? ""}
            onChange={handleChange}
            options={[
              { label: "-- Pilih Rumah --", value: "" },
              ...houses.map((house) => ({
                label: `${house.house_number}`,
                value: String(house.id),
              })),
            ]}
            placeholder="Pilih Rumah"
          />
          <p className="text-sm text-gray-500 mt-1">
            Opsional – jika belum ada rumah, bisa dikosongkan.
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
