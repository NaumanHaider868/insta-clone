import Main from "./pages/Public/HomeComponents/Main";
import { Route, Routes } from "react-router-dom";
import ExplorePage from "./pages/Public/HomeComponents/Search";
import MainLayout from "./pages/MainLayout";
import Messages from "./pages/Public/HomeComponents/Messages";
import UserProfile from "./pages/Public/HomeComponents/UserProfile";
import ReelsPage from "./pages/Public/HomeComponents/Reels";
import Login from "./pages/Public/Auth/Login";
import RequireAuth from "./components/RequireAuth";
import { useEffect, useState } from "react";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    // <div className="min-h-screen">
    //   {/* login page is not ready for now
    //   <Login /> */}
    //   <div className="main-home pt-4 w-full h-full">
    //     <Navbar />
    //     <section className="sec-content flex">
    //       <Sidebar />
    //       <div className="content w-full h-full pt-5">
    //         <div className="flex">
    //           <div className="1 w-[75%] h-full pl-32 ">
    //             <div className="story-content pb-5">
    //               <StoryRow />
    //             </div>
    //             <Main />
    //           </div>
    //           <div className="2 w-[25%] h-full flex justify-center items-center flex-col">
    //             <Suggestions />
    //           </div>
    //         </div>
    //       </div>
    //     </section>
    //   </div>
    // </div>
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout isMobile={isMobile} setIsMobile={setIsMobile} />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Main />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="inbox" element={<Messages isMobile={isMobile} setIsMobile={setIsMobile} />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="reels" element={<ReelsPage />} />
      </Route>
      {/* <Route path="/auth" element={<MainLayout />}>
          <Route path="login" element={<ExplorePage />} />
          <Route path="signup" element={<ExplorePage />} />
        </Route> */}
    </Routes>
  );
}

export default App;
