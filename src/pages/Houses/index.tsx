import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { House } from "../../types/house";
import { deleteHouse, getHouses } from "../../services/houses";
import { FaEdit, FaEye, FaHome, FaTrash, FaUsers } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import HeaderSection from "../../components/ui/HeaderSection";
import StatsCard from "../../components/ui/stats/StatsCard";
import ControlsBar from "../../components/ui/controls/ControlsBar";
import BaseTable from "../../components/ui/table/BaseTable";
import EmptyState from "../../components/ui/empty/EmptyState";
import HouseCard from "../../components/ui/cards/HouseCard";

export default function HousesPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOccupied, setFilterOccupied] = useState<
    "all" | "occupied" | "vacant"
  >("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHouses();
        setHouses(data);
      } catch (error) {
        console.error("Error fetching houses:", error);
      }
    };
    fetchData();
  }, []);

  const filteredHouses = houses.filter((house) => {
    const matchesSearch = house.house_number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterOccupied === "all" ||
      (filterOccupied === "occupied" && house.is_occupied) ||
      (filterOccupied === "vacant" && !house.is_occupied);

    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus penghuni ini?")) return;

    try {
      await deleteHouse(id);
      setHouses((prev) => prev.filter((r) => r.id !== id));
      alert("Penghuni berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus penghuni");
    }
  };

  const occupied = houses.filter((h) => h.is_occupied).length;
  const vacant = houses.length - occupied;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <HeaderSection
        title="Daftar Rumah"
        description="Kelola data rumah dalam RT"
        icon={<FaHome size={24} />}
        actionText="Tambah Rumah"
        actionLink="/houses/create"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Rumah"
          value={houses.length}
          icon={<FaHome className="text-blue-600" size={24} />}
          iconBg="bg-blue-100"
        />

        <StatsCard
          title="Rumah Dihuni"
          value={occupied}
          icon={<FaUsers className="text-green-600" size={24} />}
          iconBg="bg-green-100"
          textColor="text-green-600"
        />

        <StatsCard
          title="Rumah Kosong"
          value={vacant}
          icon={<FaUserXmark className="text-orange-600" size={24} />}
          iconBg="bg-orange-100"
          textColor="text-orange-600"
        />
      </div>

      {/* Controls */}
      <ControlsBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filterValue={filterOccupied}
        onFilterChange={(val) =>
          setFilterOccupied(val as "all" | "occupied" | "vacant")
        }
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        placeholder="Cari nomor rumah..."
        filterOptions={[
          { value: "all", label: "Semua Status" },
          { value: "occupied", label: "Dihuni" },
          { value: "vacant", label: "Kosong" },
        ]}
      />

      {/* Content */}
      {viewMode === "table" ? (
        <BaseTable
          data={filteredHouses}
          emptyMessage="Tidak ada rumah ditemukan"
          columns={[
            {
              header: "Nomor Rumah",
              key: "house_number",
              render: (house) => (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaHome className="text-blue-600" size={16} />
                  </div>
                  <span className="font-semibold text-slate-800">
                    {house.house_number}
                  </span>
                </div>
              ),
            },
            {
              header: "Status",
              key: "is_occupied",
              render: (house) => (
                <span
                  className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                    house.is_occupied
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {house.is_occupied ? (
                    <FaUsers size={14} />
                  ) : (
                    <FaUserXmark size={14} />
                  )}
                  <span>{house.is_occupied ? "Dihuni" : "Kosong"}</span>
                </span>
              ),
            },
            {
              header: "Aksi",
              key: "actions",
              render: (house) => (
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/houses/${house.id}`}
                    title="Lihat Detail"
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FaEye size={16} />
                  </Link>
                  <Link
                    to={`/houses/${house.id}/edit`}
                    title="Edit"
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FaEdit size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(house.id)}
                    title="Hapus"
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              ),
            },
          ]}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHouses.map((house) => (
            <HouseCard
              key={house.id}
              id={house.id}
              house_number={house.house_number}
              is_occupied={house.is_occupied}
            />
          ))}

          {filteredHouses.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                title="Tidak ada rumah ditemukan"
                description="Coba ubah filter pencarian Anda"
                icon={
                  <FaUserXmark
                    size={48}
                    className="mx-auto text-slate-300 mb-4"
                  />
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
