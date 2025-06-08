import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Resident } from "../../types/resident";
import { deleteResident, getResidents } from "../../services/residents";
import HeaderSection from "../../components/ui/HeaderSection";
import { FaEdit, FaIdCard, FaTrash, FaUsers } from "react-icons/fa";
import ControlsBar from "../../components/ui/controls/ControlsBar";
import BaseTable from "../../components/ui/table/BaseTable";

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "tetap" | "kontrak">(
    "all"
  );
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedKtp, setSelectedKtp] = useState<string | null>(null);

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch = resident.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || resident.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    getResidents().then(setResidents);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus penghuni ini?")) return;

    try {
      await deleteResident(id);
      setResidents((prev) => prev.filter((r) => r.id !== id));
      alert("Penghuni berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus penghuni");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <HeaderSection
        title="Daftar Penghuni"
        description="Kelola data penghuni dalam RT"
        icon={<FaUsers size={24} />}
        actionText="Tambah Penghuni"
        actionLink="/residents/create"
      />

      <ControlsBar
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={filterStatus}
        onFilterChange={(val) =>
          setFilterStatus(val as "all" | "tetap" | "kontrak")
        }
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterOptions={[
          { value: "all", label: "Semua Status" },
          { value: "tetap", label: "Tetap" },
          { value: "kontrak", label: "Kontrak" },
        ]}
      />

      <BaseTable
        data={filteredResidents}
        emptyMessage="Tidak ada rumah ditemukan"
        columns={[
          {
            header: "Nama Penghuni",
            key: "name",
            render: (resident) => (
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-slate-800">
                  {resident.name}
                </span>
              </div>
            ),
          },
          {
            header: "Status",
            key: "status",
            render: (resident) => (
              <span
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                  resident.status?.toLowerCase() === "tetap"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                <span>{resident.status}</span>
              </span>
            ),
          },
          {
            header: "No Telp",
            key: "phone",
            render: (resident) => (
              <div className="flex items-center space-x-3">
                <span className="text-slate-800">{resident.phone}</span>
              </div>
            ),
          },
          {
            header: "Menikah",
            key: "is_married",
            render: (resident) => (
              <span
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                  resident.is_married
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <span>{resident.is_married ? "Ya" : "Belum"}</span>
              </span>
            ),
          },
          {
            header: "Aksi",
            key: "actions",
            render: (resident) => (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/residents/${resident.id}/edit`}
                  title="Edit"
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FaEdit size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(resident.id)}
                  title="Hapus"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FaTrash size={16} />
                </button>
                {resident.ktp_photo && (
                  <button
                    onClick={() => setSelectedKtp(resident.ktp_photo)}
                    title="Lihat KTP"
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  >
                    <FaIdCard size={16} />
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />
      {selectedKtp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full relative">
            <button
              onClick={() => setSelectedKtp(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>
            <img
              src={`http://localhost:8000/storage/${selectedKtp}`}
              alt="KTP"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
