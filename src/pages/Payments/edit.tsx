import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Resident } from "../../types/resident";
import type { PaymentItem } from "../../types/payment";
import { getActiveResidents} from "../../services/residents";
import { getPaymentById, updatePayment } from "../../services/payments";
import SelectInput from "../../components/forms/selectInput";
import ErrorMessage from "../../components/forms/errorMessage";
import TextInput from "../../components/forms/textInput";

export default function EditPaymentPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    resident_id: 0,
    total_amount: 0,
    note: "",
    status: "lunas",
    payment_date: "",
  });
  const [items, setItems] = useState<PaymentItem[]>([]);

  useEffect(() => {
    getActiveResidents().then(setResidents);
  }, []);

  useEffect(() => {
    if (id) {
      getPaymentById(Number(id)).then((data) => {
        setForm({
          resident_id: data.resident_id,
          total_amount: data.total_amount,
          note: data.note,
          status: data.status,
          payment_date: data.payment_date,
        });
        setItems(data.payment_items);
      });
    }
  }, [id]);

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
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { type: "kebersihan", amount: 0, start_date: "", end_date: "" },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.resident_id) newErrors.resident_id = "Penghuni wajib dipilih";
    if (!form.payment_date) newErrors.payment_date = "Tanggal wajib diisi";
    if (items.length === 0) newErrors.items = "Minimal 1 item diperlukan";

    items.forEach((item, i) => {
      if (!item.amount || item.amount <= 0) {
        newErrors[`item_amount_${i}`] = "Nominal wajib lebih dari 0";
      }
      if (!item.start_date) {
        newErrors[`item_start_date_${i}`] = "Tanggal mulai wajib diisi";
      }
      if (!item.end_date) {
        newErrors[`item_end_date_${i}`] = "Tanggal akhir wajib diisi";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!validateForm()) return;

    const payload = {
      ...form,
      items,
    };

    try {
      await updatePayment(Number(id), payload);
      alert("Pembayaran berhasil diperbarui");
      navigate("/payments");
    } catch (err) {
      alert("Gagal memperbarui Pembayaran");
    }
  };

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Edit Pembayaran</h1>

      <form onSubmit={handleSubmit} className="space-y-4 p-6">
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
          <label className="block font-medium mb-2">
            Detail Pembayaran (Payment Items)
          </label>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 mb-3 items-end">
              <select
                value={item.type}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "type",
                    e.target.value as "satpam" | "kebersihan"
                  )
                }
                className="border px-2 py-1 rounded"
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

              {errors[`item_amount_${index}`] && (
                <p className="col-span-5 text-red-500 text-sm">
                  {errors[`item_amount_${index}`]}
                </p>
              )}
              {errors[`item_start_date_${index}`] && (
                <p className="col-span-5 text-red-500 text-sm">
                  {errors[`item_start_date_${index}`]}
                </p>
              )}
              {errors[`item_end_date_${index}`] && (
                <p className="col-span-5 text-red-500 text-sm">
                  {errors[`item_end_date_${index}`]}
                </p>
              )}
            </div>
          ))}
          {errors.items && (
            <p className="text-red-500 text-sm">{errors.items}</p>
          )}
          <button
            type="button"
            onClick={addItem}
            className="text-blue-600 text-sm"
          >
            + Tambah Item
          </button>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
