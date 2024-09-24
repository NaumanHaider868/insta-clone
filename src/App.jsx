import Main from "./pages/Public/HomeComponents/Main";
import { Route, Routes } from "react-router-dom";
import ExplorePage from "./pages/Public/HomeComponents/Search";
import MainLayout from "./pages/MainLayout";
import Messages from "./pages/Public/HomeComponents/Messages";
import UserProfile from "./pages/Public/HomeComponents/UserProfile";
import ReelsPage from "./pages/Public/HomeComponents/Reels";
import Notifications from "./pages/Public/HomeComponents/Notifications";

function App() {
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
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Main />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="inbox" element={<Messages />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="reels" element={<ReelsPage />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
      {/* <Route path="/auth" element={<MainLayout />}>
          <Route path="login" element={<ExplorePage />} />
          <Route path="signup" element={<ExplorePage />} />
        </Route> */}
    </Routes>
  );
}

export default App;
