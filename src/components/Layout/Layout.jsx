import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Layout.css";
import FooterBreadcrumb from "../FooterBreadcrumb/FooterBreadcrumb";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (mobileView) setSidebarOpen((prev) => !prev);
    else setCollapsed((prev) => !prev);
  };

  const sidebarWidth = collapsed ? 70 : 260;

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        mobileView={mobileView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setCollapsed={setCollapsed}
      />

      {/* Main Content */}
      <div
        className="main-layout"
        style={{
          marginLeft: !mobileView ? `${sidebarWidth}px` : 0,
        }}
      >
        <Topbar toggleSidebar={toggleSidebar} mobileView={mobileView} />
        <main className="main-content">
          <Outlet />
        </main>
        <FooterBreadcrumb />
      </div>
    </div>
  );
}
