import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Public/Navbar";
import Sidebar from "./Public/Sidebar";

function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <div className={`main-home ${location.pathname === "/reels" ? "" : 'pt-4'} w-full h-screen`}>
        {(location.pathname === '/inbox' || location.pathname === '/explore' || location.pathname === "/reels") ? null : <Navbar />}
        <section className="sec-content flex h-full">
          <Sidebar />
          <div className="content w-full h-full">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainLayout;
