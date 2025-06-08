import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface HeaderSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionText?: string;
  actionLink?: string;
}

export default function HeaderSection({
  title,
  description,
  icon,
  actionText,
  actionLink,
}: HeaderSectionProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          {icon && <div className="p-3 bg-white/20 rounded-xl">{icon}</div>}
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && <p className="text-blue-100">{description}</p>}
          </div>
        </div>
        {actionLink && (
          <Link
            to={actionLink}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <span>{actionText || "Tambah"}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
