import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  FaUsers,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
} from "react-icons/fa";
import HeaderSection from "../../components/ui/HeaderSection";
import { formatRupiah } from "../../lib/format";

type MonthlySummary = {
  month: string;
  total_pemasukan: number;
  total_pengeluaran: number;
  saldo: number;
};

type TotalSummary = {
  total_pemasukan: number;
  total_pengeluaran: number;
  saldo: number;
};

export default function DashboardPage() {
  const [summaryData, setSummaryData] = useState<MonthlySummary[]>([]);
  const [totalSummary, setTotalSummary] = useState<TotalSummary>({
    total_pemasukan: 0,
    total_pengeluaran: 0,
    saldo: 0,
  });
  const [totalResident, setTotalResident] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:8000/api/report/monthly-summary"
        );
        if (!response.ok) throw new Error("Gagal mengambil data dari server");

        const data: {
          monthly: MonthlySummary[];
          total: TotalSummary;
          total_penghuni: number;
        } = await response.json();

        setSummaryData(data.monthly);
        setTotalSummary(data.total);
        setTotalResident(data.total_penghuni);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const dashboardCards = [
    {
      title: "Total Penghuni",
      value: totalResident,
      changeType: "increase",
      icon: FaUsers,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Total Pemasukan",
      value: formatRupiah(totalSummary.total_pemasukan),
      changeType: "increase",
      icon: FaArrowUp,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      title: "Total Pengeluaran",
      value: formatRupiah(totalSummary.total_pengeluaran),
      changeType: "increase",
      icon: FaArrowDown,
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100",
    },
    {
      title: "Saldo Bersih",
      value: formatRupiah(totalSummary.saldo),
      changeType: "increase",
      icon: FaMoneyBillWave,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Bulan: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatRupiah(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}

        <HeaderSection
          title="Dashboard"
          description="Kelola data keuangan dan penghuni dengan mudah"
          icon={<FaChartLine size={24} />}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${card.bgGradient} rounded-xl p-6 border border-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-lg`}
                  >
                    <IconComponent className="text-white" size={24} />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Perbandingan Bulanan
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={summaryData}>
              <defs>
                <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorPengeluaran"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis
                stroke="#6b7280"
                tickFormatter={(value) => `${value / 1000000}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="total_pemasukan"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPemasukan)"
                name="Pemasukan"
              />
              <Area
                type="monotone"
                dataKey="total_pengeluaran"
                stroke="#ef4444"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPengeluaran)"
                name="Pengeluaran"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
