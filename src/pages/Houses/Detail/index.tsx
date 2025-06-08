import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaEdit,
  FaHome,
  FaMoneyBillWave,
  FaPlus,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import HeaderSection from "../../../components/ui/HeaderSection";
import { getHouse } from "../../../services/houses";
import { getResidents } from "../../../services/residents";
import type { House } from "../../../types/house";
import type { Resident } from "../../../types/resident";
import {
  createInhabitantHistories,
  deleteInhabitantHistories,
} from "../../../services/inhabitantHistories";
import Modal from "../../../components/ui/Modal";

export default function HouseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [house, setHouse] = useState<House | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [activeTab, setActiveTab] = useState<"info" | "payments">("info");
  const [residents, setResidents] = useState<Resident[]>([]);

  const fetchDetail = async () => {
    try {
      const data = await getHouse(Number(id));
      setHouse(data);
    } catch (err) {
      console.error("Gagal memuat detail rumah:", err);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const openModal = async () => {
    try {
      const data = await getResidents();
      setResidents(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Gagal memuat data penghuni:", err);
    }
  };

  const handleDelete = async (inhabitantId: number) => {
    if (!confirm("Yakin ingin menghapus penghuni ini?")) return;

    try {
      await deleteInhabitantHistories(inhabitantId);
      await fetchDetail();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus penghuni");
    }
  };

  if (!house) {
     return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat detail rumah...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <HeaderSection
        title={`Detail Rumah ${house.house_number}`}
        description="Informasi lengkap rumah dan riwayat penghuni"
        icon={<FaHome size={24} />}
        actionText="Kembali"
        actionLink="/houses"
      />
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "info"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("info")}
            >
              <div className="flex items-center gap-2">
                <FaUser size={16} />
                Informasi & Penghuni
              </div>
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "payments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("payments")}
            >
              <div className="flex items-center gap-2">
                <FaMoneyBillWave size={16} />
                Riwayat Pembayaran
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "info" && (
            <div className="space-y-6">
              {/* Resident History */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Riwayat Penghuni
                  </h3>
                  <button
                    onClick={openModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
                  >
                    <FaPlus size={16} />
                    Tambah Penghuni
                  </button>
                </div>

                {house.inhabitant_histories?.length === 0 ? (
                  <div className="text-center py-12">
                    <FaUser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      Belum ada riwayat penghuni
                    </p>
                    <p className="text-gray-400 text-sm">
                      Klik tombol "Tambah Penghuni" untuk memulai
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {house.inhabitant_histories?.map((history) => (
                      <div
                        key={history.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaUser className="text-blue-600" size={16} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {history.resident.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {history.start_date} -{" "}
                                  {history.end_date ?? "Sekarang"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Link
                            to={`/inhabitant-histories/${history.id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit Penghuni"
                          >
                            <FaEdit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(history.id)}
                            title="Hapus"
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Riwayat Pembayaran
              </h3>
              {!house.payments || house.payments.length === 0 ? (
                <div className="text-center py-12">
                  <FaMoneyBillWave className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Belum ada riwayat pembayaran
                  </p>
                  <p className="text-gray-400 text-sm">
                    Pembayaran akan muncul di sini setelah ada transaksi
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {house.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <FaMoneyBillWave
                              className="text-green-600"
                              size={16}
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {payment.resident.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {payment.payment_date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            Rp {payment.total_amount.toLocaleString()}
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payment.status === "lunas"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Penghuni Rumah"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await createInhabitantHistories({
              house_id: house.id,
              resident_id: Number(selectedResidentId),
              start_date: startDate,
            });
            setIsModalOpen(false);
            setSelectedResidentId("");
            setStartDate("");
            location.reload();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block font-medium">Pilih Penghuni</label>
            <select
              value={selectedResidentId}
              onChange={(e) => setSelectedResidentId(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Pilih Penghuni --</option>
              {residents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Tanggal Masuk</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
