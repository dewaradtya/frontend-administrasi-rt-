import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Resident } from "../../types/resident";
import { getActiveResidents } from "../../services/residents";
import { createPayment } from "../../services/payments";
import SelectInput from "../../components/forms/selectInput";
import ErrorMessage from "../../components/forms/errorMessage";
import TextInput from "../../components/forms/textInput";
import type { PaymentItem } from "../../types/payment";

export default function CreatePaymentPage() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    resident_id: 0,
    total_amount: 0,
    note: "",
    status: "lunas",
    payment_date: "",
  });
  const [items, setItems] = useState<PaymentItem[]>([
    { type: "satpam", amount: 0, start_date: "", end_date: "" },
  ]);

  useEffect(() => {
    getActiveResidents().then(setResidents);
  }, []);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setForm((prev) => ({ ...prev, total_amount: total }));
  }, [items]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "resident_id" ? Number(value) : value,
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof PaymentItem,
    value: any
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { type: "kebersihan", amount: 0, start_date: "", end_date: "" },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.resident_id) newErrors.resident_id = "Penghuni wajib dipilih";
    if (!form.payment_date) newErrors.payment_date = "Tanggal wajib diisi";
    if (items.length === 0) newErrors.items = "Minimal 1 item pembayaran";

    items.forEach((item, i) => {
      if (item.amount <= 0)
        newErrors[`items.${i}.amount`] = "Nominal harus lebih dari 0";
      if (!item.start_date)
        newErrors[`items.${i}.start_date`] = "Tanggal mulai wajib diisi";
      if (!item.end_date)
        newErrors[`items.${i}.end_date`] = "Tanggal akhir wajib diisi";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createPayment({ ...form, items });
      alert("Berhasil menambahkan pembayaran");
      navigate("/payments");
    } catch {
      alert("Gagal menambahkan pembayaran");
    }
  };

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Tambah Pembayaran</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6"
      >
        <div>
          <label className="block font-medium mb-1">Penghuni</label>
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
          <label className="block font-medium mb-1">Tanggal Pembayaran</label>
          <TextInput
            name="payment_date"
            type="date"
            value={form.payment_date}
            onChange={handleChange}
          />
          <ErrorMessage message={errors.payment_date} />
        </div>

        <div>
          <label className="block font-medium mb-1">Catatan</label>
          <TextInput
            name="note"
            type="text"
            value={form.note}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <SelectInput
            name="status"
            value={form.status}
            onChange={handleChange}
            options={[
              { label: "Lunas", value: "lunas" },
              { label: "Belum Lunas", value: "belum lunas" },
            ]}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Detail Pembayaran</label>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 mb-2">
              <select
                className="border px-2 py-1 rounded"
                value={item.type}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "type",
                    e.target.value as "satpam" | "kebersihan"
                  )
                }
              >
                <option value="satpam">Satpam</option>
                <option value="kebersihan">Kebersihan</option>
              </select>
              <input
                type="number"
                className="border px-2 py-1 rounded"
                placeholder="Nominal"
                value={item.amount}
                onChange={(e) =>
                  handleItemChange(index, "amount", Number(e.target.value))
                }
              />
              <input
                type="date"
                className="border px-2 py-1 rounded"
                value={item.start_date}
                onChange={(e) =>
                  handleItemChange(index, "start_date", e.target.value)
                }
              />
              <input
                type="date"
                className="border px-2 py-1 rounded"
                value={item.end_date}
                onChange={(e) =>
                  handleItemChange(index, "end_date", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 text-sm"
              >
                Hapus
              </button>
            </div>
          ))}
          {errors.items && <ErrorMessage message={errors.items} />}
          <button
            type="button"
            onClick={addItem}
            className="text-blue-600 text-sm"
          >
            + Tambah Item
          </button>
        </div>

        <p className="font-semibold">
          Total: Rp {form.total_amount.toLocaleString("id-ID")}
        </p>

        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan Pembayaran
          </button>
        </div>
      </form>
    </div>
  );
}
