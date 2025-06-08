import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHouseById, updateHouse } from "../../services/houses";
import type { House } from "../../types/house";
import TextInput from "../../components/forms/textInput";
import CheckboxInput from "../../components/forms/checkboxInput";
import ErrorMessage from "../../components/forms/errorMessage";

export default function EditHousePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<House, "id">>({
    house_number: "",
    is_occupied: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getHouseById(Number(id));
        setForm({
          house_number: data.house_number,
          is_occupied: data.is_occupied,
        });
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data rumah");
        navigate("/houses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.house_number.trim()) {
      newErrors.house_number = "Nomor rumah wajib diisi.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!validate()) return;

    try {
      await updateHouse(Number(id), form);
      alert("Data rumah berhasil diperbarui");
      navigate("/houses");
    } catch (err: any) {
      console.error(err);

      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const formattedErrors: Record<string, string> = {};

        Object.entries(backendErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            formattedErrors[field] = messages.join(" ");
          } else if (typeof messages === "string") {
            formattedErrors[field] = messages;
          }
        });

        setErrors(formattedErrors);
      } else {
        alert("Gagal memperbarui rumah");
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Edit Rumah</h1>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Rumah
          </label>
          <TextInput
            name="house_number"
            value={form.house_number}
            onChange={handleChange}
            placeholder="Contoh: A-12"
            aria-invalid={!!errors.house_number}
            aria-describedby="house-number-error"
          />
          <ErrorMessage message={errors.house_number} id="house-number-error" />
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <CheckboxInput
                name="is_occupied"
                checked={form.is_occupied}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status Hunian
              </label>
              <p className="text-sm text-gray-600">
                Centang jika rumah ini sudah dihuni oleh penghuni
              </p>
              {form.is_occupied && (
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sudah Dihuni
                </div>
              )}
            </div>
          </div>
          <ErrorMessage message={errors.is_occupied} />
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
