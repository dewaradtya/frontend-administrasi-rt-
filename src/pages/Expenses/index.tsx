import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Expense } from "../../types/expense";
import { deleteExpense, getExpenses } from "../../services/expenses";
import { formatRupiah } from "../../lib/format";
import HeaderSection from "../../components/ui/HeaderSection";
import {
  FaEdit,
  FaReceipt,
  FaTrash,
} from "react-icons/fa";
import ControlsBar from "../../components/ui/controls/ControlsBar";
import BaseTable from "../../components/ui/table/BaseTable";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filterOptions = [
    { value: "all", label: "Semua Bulan" },
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const filteredExpenses = expenses.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || r.date.slice(5, 7) === filter; // ambil bulan dari tanggal (format yyyy-mm-dd)

    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    getExpenses().then(setExpenses);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus penghuni ini?")) return;

    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((r) => r.id !== id));
      alert("Pengeluaran berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus pengeluaran");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <HeaderSection
        title="Daftar Pengeluaran"
        description="Kelola data pengeluaran dalam RT"
        icon={<FaReceipt size={24} />}
        actionText="Tambah Pengeluaran"
        actionLink="/expenses/create"
      />

      <ControlsBar
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={filter}
        onFilterChange={setFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterOptions={filterOptions}
      />
      
      <BaseTable
        data={filteredExpenses}
        emptyMessage="Tidak ada rumah ditemukan"
        columns={[
          {
            header: "Nama Pengeluaran",
            key: "name",
            render: (expense) => (
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-slate-800">
                  {expense.name}
                </span>
              </div>
            ),
          },
          {
            header: "Jumlah Pengeluaran",
            key: "amount",
            render: (expense) => (
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-slate-800">
                  {formatRupiah(expense.amount)}
                </span>
              </div>
            ),
          },
          {
            header: "Tanggal Pengeluaran",
            key: "date",
            render: (expense) => (
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-slate-800">
                  {expense.date}
                </span>
              </div>
            ),
          },
          {
            header: "Aksi",
            key: "actions",
            render: (expense) => (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/expenses/${expense.id}/edit`}
                  title="Edit"
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FaEdit size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(expense.id)}
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
    </div>
  );
}
