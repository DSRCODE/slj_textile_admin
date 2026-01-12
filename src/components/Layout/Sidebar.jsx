import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaList, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BsStack } from "react-icons/bs";
import { MdRestorePage } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    name: "Category Management",
    icon: <BsStack />,
    path: "/",
  },
  {
    name: "Products",
    icon: <FaBoxOpen />,
    children: [
      { name: "Create Product", icon: <FaPlus />, path: "/create_product" },
      { name: "Product List", icon: <FaList />, path: "/product_list" },
    ],
  },
  {
    name: "CMS Management",
    icon: <MdRestorePage />,
    path: "/cms",
  },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileView,
  sidebarOpen,
  setSidebarOpen,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [openMenu, setOpenMenu] = React.useState("");

  const handleDropdown = (name) => {
    if (!mobileView && collapsed) {
      setCollapsed(false);
      setOpenMenu(name);
    } else {
      setOpenMenu((prev) => (prev === name ? "" : name));
    }
  };

  const closeSidebar = () => {
    if (mobileView) setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileView && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed z-50 h-full
        bg-gradient-to-b from-[#111827] to-[#1f2937]
        text-gray-200 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${mobileView ? (sidebarOpen ? "left-0" : "-left-full") : "left-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
          <div className="w-8 h-8 p-1 rounded bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-black font-bold">
            <img src="/logo.png" alt="SLJ Textile" className="w-20" />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold tracking-wide text-white">
              SLJ Textiles
            </span>
          )}
        </div>

        {/* Menu */}
        <nav className="flex flex-col mt-4 space-y-1 px-2">
          {menuItems.map((item, idx) => {
            const isActive =
              location.pathname === item.path ||
              item.children?.some((child) => location.pathname === child.path);
            const isOpen = openMenu === item.name;

            return (
              <div key={idx}>
                {item.children ? (
                  <>
                    <div
                      onClick={() => handleDropdown(item.name)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
                      hover:bg-[#374151]
                      ${isActive ? "bg-[#374151] text-yellow-400" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        {!collapsed && <span>{item.name}</span>}
                      </div>
                      {!collapsed &&
                        (isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />)}
                    </div>

                    {isOpen &&
                      (!collapsed || mobileView) &&
                      item.children.map((child, i) => (
                        <Link
                          key={i}
                          to={child.path}
                          onClick={closeSidebar}
                          className={`ml-8 mt-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                          hover:bg-[#374151]
                          ${
                            location.pathname === child.path
                              ? "bg-[#374151] text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          {child.icon}
                          <span>{child.name}</span>
                        </Link>
                      ))}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg
                    hover:bg-[#374151]
                    ${isActive ? "bg-[#374151] text-yellow-400" : ""}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="absolute bottom-4 left-2 right-2 flex items-center gap-3
          px-3 py-2 rounded-lg cursor-pointer
          bg-gradient-to-r from-red-500 to-red-600
          hover:from-red-600 hover:to-red-700
          text-white transition"
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </div>
      </aside>
    </>
  );
}
