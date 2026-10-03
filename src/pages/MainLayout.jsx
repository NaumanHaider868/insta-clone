import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SocketProvider } from "../context/SocketContext";
import Navbar from "./Public/Navbar";
import Sidebar from "./Public/Sidebar";

function MainLayout({ isMobile, setIsMobile }) {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('dark-mode') !== 'false');

  useEffect(() => {
    localStorage.setItem('dark-mode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  return (
    <SocketProvider>
    <div className={`h-auto`}>
      <div className={`main-home ${location.pathname === "/reels" ? "" : 'pt-4'} ${location.pathname === "/inbox" ? "h-screen" : 'h-auto'} w-full`}>
        {(location.pathname === '/inbox' || location.pathname === '/explore' || location.pathname === "/reels") ? null : <Navbar darkMode={darkMode} />}
        <section className="sec-content flex h-full">
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} isMobile={isMobile} setIsMobile={setIsMobile} />
          <div className="content w-full h-full">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
    </SocketProvider>
  );
}

export default MainLayout;
