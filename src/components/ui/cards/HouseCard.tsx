import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaHome, FaTrash, FaUsers } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";

interface HouseCardProps {
  id: number;
  house_number: string;
  is_occupied: boolean;
}

export default function HouseCard({ id, house_number, is_occupied }: HouseCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FaHome className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">{house_number}</h3>
            </div>
          </div>
          <span
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              is_occupied ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
            }`}
          >
            {is_occupied ? <FaUsers size={12} /> : <FaUserXmark size={12} />}
            <span>{is_occupied ? "Dihuni" : "Kosong"}</span>
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Link
            to={`/houses/${id}`}
            className="flex items-center space-x-1 text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <FaEye size={14} />
            <span>Detail</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Link
              to={`/houses/${id}/edit`}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <FaEdit size={14} />
            </Link>
            <button className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
