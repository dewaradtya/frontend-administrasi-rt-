import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      <main
        className={`${
          sidebarCollapsed ? "ml-16" : "ml-72"
        } transition-all duration-300 flex-1 p-8`}
      >
        <Header />

        <Outlet />
      </main>
    </div>
  );
}
