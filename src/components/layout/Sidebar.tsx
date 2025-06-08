import React, { useState } from 'react';
import { FaHome, FaUsers, FaCreditCard, FaReceipt, FaBuilding, FaBars, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';

type LinkItem = {
  name: string;
  path?: string;
  children?: LinkItem[];
  icon?: React.ReactNode;
};

const links: LinkItem[] = [
  { name: "Dashboard", path: "/", icon: <FaHome size={18} /> },
  { name: "Penghuni", path: "/residents", icon: <FaUsers size={18} /> },
  { name: "Rumah", path: "/houses", icon: <FaBuilding size={18} /> },
  { name: "Pembayaran", path: "/payments", icon: <FaCreditCard size={18} /> },
  { name: "Pengeluaran", path: "/expenses", icon: <FaReceipt size={18} /> },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>("Penghuni");

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-72'} transition-all duration-300 ease-in-out h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl fixed z-30 overflow-hidden`}>
      {/* Header */}
      <div className="relative p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className={`${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Administrasi RT
            </h1>
            <p className="text-slate-400 text-sm mt-1">Management System</p>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all duration-200"
          >
            {isCollapsed ? <FaBars size={18} /> : <FaX size={18} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col p-4 space-y-2 mt-4">
        {links.map((link) =>
          link.children ? (
            <div key={link.name} className="relative">
              <button
                onClick={() => toggleDropdown(link.name)}
                className={`
                  group flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl
                  transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
                  ${openDropdown === link.name 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${openDropdown === link.name ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} transition-colors`}>
                    {link.icon}
                  </div>
                  <span className={`${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                    {link.name}
                  </span>
                </div>
                <div className={`${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-all duration-200`}>
                  {openDropdown === link.name ? (
                    <FaChevronDown className="w-4 h-4" />
                  ) : (
                    <FaChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>
              
              {/* Dropdown Animation */}
              <div className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${openDropdown === link.name && !isCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
              `}>
                <div className="ml-6 flex flex-col space-y-1 mt-2 pl-6 border-l-2 border-slate-700">
                  {link.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path!}
                      className={`
                        relative px-4 py-2 text-sm rounded-lg transition-all duration-200 hover:scale-[1.02]
                        ${location.pathname === child.path
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30'
                          : 'text-slate-400 hover:bg-slate-800/30 hover:text-white'
                        }
                      `}
                    >
                      {child.name}
                      {location.pathname === child.path && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r"></div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link
              key={link.path}
              to={link.path!}
              className={`
                group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium 
                transition-all duration-200 hover:scale-[1.02] hover:shadow-lg relative
                ${location.pathname === link.path
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }
              `}
            >
              <div className={`${location.pathname === link.path ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} transition-colors`}>
                {link.icon}
              </div>
              <span className={`${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                {link.name}
              </span>
              {location.pathname === link.path && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
          )
        )}
      </nav>
    </aside>
  );
}