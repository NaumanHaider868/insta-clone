import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Public/Navbar";
import Sidebar from "./Public/Sidebar";

function MainLayout() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('dark-mode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dark-mode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  return (
    <div className="min-h-screen">
      <div className={`main-home ${location.pathname === "/reels" ? "" : 'pt-4'} w-full h-screen`}>
        {(location.pathname === '/inbox' || location.pathname === '/explore' || location.pathname === "/reels") ? null : <Navbar />}
        <section className="sec-content flex h-full">
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="content w-full h-full">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainLayout;
