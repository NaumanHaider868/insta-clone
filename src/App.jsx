import Main from "./pages/Public/HomeComponents/Main";
import { Navigate, Route, Routes } from "react-router-dom";
import ExplorePage from "./pages/Public/HomeComponents/Search";
import MainLayout from "./pages/MainLayout";
import Messages from "./pages/Public/HomeComponents/Messages";
import UserProfile from "./pages/Public/HomeComponents/UserProfile";
import ReelsPage from "./pages/Public/HomeComponents/Reels";
import Login from "./pages/Public/Auth/Login";
import Register from "./pages/Public/Auth/Register";
import { useEffect, useState } from "react";
import { getStoredSession } from "./services/api";

const ProtectedRoute = ({ children }) => {
  const { token } = getStoredSession();
  return token ? children : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const { token } = getStoredSession();
  return token ? <Navigate to="/" replace /> : children;
};

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [, setSessionVersion] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    const handleStorage = () => setSessionVersion((value) => value + 1);

    window.addEventListener("resize", handleResize);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
      <Route path="/" element={<ProtectedRoute><MainLayout isMobile={isMobile} setIsMobile={setIsMobile} /></ProtectedRoute>}>
        <Route path="/" element={<Main />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="inbox" element={<Messages isMobile={isMobile} setIsMobile={setIsMobile} />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="reels" element={<ReelsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
