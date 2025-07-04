import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextInput from "../../components/forms/textInput";
import type { Expense } from "../../types/expense";
import { getExpenseById, updateExpense } from "../../services/expenses";
import ErrorMessage from "../../components/forms/errorMessage";

export default function EditExpensePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Omit<Expense, "id">>({
    name: "",
    amount: 0,
    date: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getExpenseById(Number(id));
        setForm({
          name: data.name,
          amount: data.amount,
          date: data.date,
        });
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data rumah");
        navigate("/houses");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Nama wajib diisi";
    if (form.amount <= 0) newErrors.amount = "Nominal wajib lebih dari 0";
    if (!form.date) newErrors.date = "Tanggal wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!validate()) return;

    try {
      await updateExpense(Number(id), form);
      alert("Data pengeluaran berhasil diperbarui");
      navigate("/expenses");
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui pengeluaran");
    }
  };

  return (
    <div className="max-w-xl p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Edit Pengeluaran</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Pengeluaran
          </label>
          <TextInput
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Contoh: Pembelian Alat Kebersihan"
          />
          <ErrorMessage message={errors.name} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah (Rp)
          </label>
          <TextInput
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="Contoh: 150000"
          />
          <ErrorMessage message={errors.amount} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Pengeluaran
          </label>
          <TextInput
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
          <ErrorMessage message={errors.date} />
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
