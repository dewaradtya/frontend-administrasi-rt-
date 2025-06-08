import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && <div className="mx-auto mb-4">{icon}</div>}
      <p className="text-slate-500 text-lg font-medium">{title}</p>
      {description && <p className="text-slate-400">{description}</p>}
    </div>
  );
}
