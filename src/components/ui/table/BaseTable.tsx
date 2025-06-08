import { ReactNode } from "react";

interface Column {
  header: string;
  key: string;
  render?: (row: any) => ReactNode;
}

interface BaseTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
}

export default function BaseTable({ columns, data, emptyMessage = "Data tidak tersedia" }: BaseTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center px-6 py-12 text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
