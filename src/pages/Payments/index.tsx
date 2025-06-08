import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import type { Payment } from "../../types/payment";
import { deletePayment, getPayments } from "../../services/payments";
import { formatRupiah } from "../../lib/format";
import { FaCreditCard, FaEdit, FaTrash } from "react-icons/fa";
import HeaderSection from "../../components/ui/HeaderSection";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    getPayments().then(setPayments);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus penghuni ini?")) return;

    try {
      await deletePayment(id);
      setPayments((prev) => prev.filter((r) => r.id !== id));
      alert("Penghuni berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus penghuni");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <HeaderSection
        title="Daftar Pembayaran"
        description="Kelola data pembayaran dalam RT"
        icon={<FaCreditCard size={24} />}
        actionText="Tambah Pembayaran"
        actionLink="/payments/create"
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Nama Penghuni
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Nomor Rumah
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Total Pembayaran
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Catatan
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status Pembayaran
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payments.map((r) => (
                <Fragment key={r.id}>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{r.resident?.name ?? "-"}</td>
                    <td className="px-6 py-4">
                      {r.house?.house_number ?? "-"}
                    </td>
                    <td className="px-6 py-4">
                      {formatRupiah(r.total_amount)}
                    </td>
                    <td className="px-6 py-4">{r.note}</td>
                    <td className="px-6 py-4">{r.status}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/payments/${r.id}/edit`}
                          title="Edit"
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(r.id)}
                          title="Hapus"
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Rincian Payment Items */}
                  <tr className="bg-gray-50 text-xs">
                    <td colSpan={6} className="p-4">
                      <div className="space-y-1">
                        {r.payment_items && r.payment_items.length > 0 ? (
                          r.payment_items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between border-b pb-1"
                            >
                              <span className="capitalize">{item.type}</span>
                              <span>{formatRupiah(item.amount)}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 italic">
                            Tidak ada rincian pembayaran
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-400">
                    Belum ada data pembayaran
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
