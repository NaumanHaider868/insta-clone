import Login from "./pages/Public/Auth/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Public/HomeComponents/Main";
import Messages from "./pages/Public/HomeComponents/Messages";
import Search from "./pages/Public/HomeComponents/Search";

function App() {
  return (
    <div className="min-h-screen">
      {/* login page is not ready for now 
      <Login /> */}
      {/* <div className="main-home pt-4 w-full h-full">
        <Navbar />
        <section className="sec-content flex">
          <Sidebar />
          <div className="content w-full h-full pt-5">
            <div className="flex">
              <div className="1 w-[75%] h-full pl-32 ">
                <div className="story-content pb-5">
                  <StoryRow />
                </div>
                <Main />
              </div>
              <div className="2 w-[25%] h-full flex justify-center items-center flex-col">
                <Suggestions />
              </div>
            </div>
          </div>
        </section>
      </div> */}
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/inbox" element={<Messages />} />
          <Route path="/explore" element={<Search />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
