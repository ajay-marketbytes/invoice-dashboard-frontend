import React, { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Topbar onLogout={onLogout} toggleSidebar={toggleSidebar} />
        <div className="bg-gray-200 flex-1 overflow-x-hidden overflow-y-auto z-0 bg-gradient-to-l from-gray-100 to-gray-300 pl-[288px] pt-[80px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;