import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../pages/MainLayout";
import Login from "../pages/Public/Auth/Login";
import Register from "../pages/Public/Auth/Register";
import VerifyEmail from "../pages/Public/Auth/VerifyEmail";
import Main from "../pages/Public/HomeComponents/Main";
import Messages from "../pages/Public/HomeComponents/Messages";
import ExplorePage from "../pages/Public/HomeComponents/Search";
import SeeAllSuggestions from "../pages/Public/HomeComponents/SeeAllSuggestions";
import ReelsPage from "../pages/Public/HomeComponents/Reels";
import UserProfile from "../pages/Public/HomeComponents/UserProfile";
import NotFound from "../pages/NotFound";
import { getStoredSession } from "../services/api";

const ProtectedRoute = ({ children }) => {
  const { token } = getStoredSession();
  return token ? children : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const { token } = getStoredSession();
  return token ? <Navigate to="/" replace /> : children;
};

function AppRoutes({ isMobile, setIsMobile }) {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout isMobile={isMobile} setIsMobile={setIsMobile} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Main />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="inbox" element={<Messages isMobile={isMobile} setIsMobile={setIsMobile} />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="see-all" element={<SeeAllSuggestions />} />
        <Route path="reels" element={<ReelsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
