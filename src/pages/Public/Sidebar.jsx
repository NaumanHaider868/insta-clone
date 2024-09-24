import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SearchIcon from "../../assets/images/action-icons/search-default.svg";
import HomeIcon from "../../assets/images/action-icons/home-default.svg";
import LikeIcon from "../../assets/images/action-icons/like-default.svg";
import UserIcon from "../../assets/images/action-icons/user-default.svg";
import MsgIcon from "../../assets/images/action-icons/msg-default.svg";
import ReelsIcon from "../../assets/images/action-icons/reel-default.svg";

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col items-center p-4 space-y-6 bg-[#EFEFEF] rounded-[87px] h-[440px] fixed left-[28px] top-[100px]">
      <div className="h-full flex justify-between items-center flex-col">
        <button className={`p-2 ${location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/">
            <img src={HomeIcon} className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
        <button className={`p-2 ${location.pathname === '/explore' ? 'active' : ''}`}>
          <Link to="/explore">
            <img src={SearchIcon} className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
        <button className={`p-2 ${location.pathname === '/reels' ? 'active' : ''}`}>
          <Link to='/reels'>
            <img src={ReelsIcon} className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
        <button className={`p-2 ${location.pathname === '/inbox' ? 'active' : ''}`}>
          <Link to="/inbox">
            <img src={MsgIcon} className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
        <button className={`p-2 ${location.pathname === '/reels' ? 'active' : ''}`}>
          <img src={LikeIcon} className="w-6 h-6 text-gray-700" />
        </button>
        <button className={`p-2 ${location.pathname === '/profile' ? 'active' : ''}`}>
          <Link to='/profile'>
            <img src={UserIcon} className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
