import React from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ toggleSidebar, mobileView }) {
  const { user } = useAuth();

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between
      h-16 px-4 bg-white border-b border-gray-200 shadow-sm"
    >
      {/* Left: Toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md text-gray-800
        hover:bg-gray-100 transition"
      >
        <FaBars size={18} />
      </button>

      {/* Right: User */}
      <div className="flex items-center gap-3">
        {!mobileView && user && (
          <div className="flex flex-col items-end leading-tight">
            <span className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
              {user.name}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {user.role}
            </span>
          </div>
        )}

        <div
          className="flex items-center justify-center w-9 h-9 rounded-full
          bg-gradient-to-r from-yellow-500 to-yellow-600"
        >
          <FaUserCircle size={22} className="text-white" />
        </div>
      </div>
    </header>
  );
}
