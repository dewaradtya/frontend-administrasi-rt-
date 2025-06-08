import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  textColor?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconBg,
  textColor = "text-slate-800",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`p-3 ${iconBg} rounded-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
