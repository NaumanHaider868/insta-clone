import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SearchIconDefault from "../../assets/images/action-icons/search-default.svg";
import SearchIcon from "../../assets/images/action-icons/search.svg";
import HomeIcon from "../../assets/images/action-icons/home.svg";
import HomeIconDefault from "../../assets/images/action-icons/home-default.svg";
import LikeIcon from "../../assets/images/action-icons/like.svg";
import LikeIconDefault from "../../assets/images/action-icons/like-default.svg";
import UserIcon from "../../assets/images/action-icons/user.svg";
import UserIconDefault from "../../assets/images/action-icons/user-default.svg";
import MsgIcon from "../../assets/images/action-icons/msg.svg";
import MsgIconDefault from "../../assets/images/action-icons/msg-default.svg";
import ReelsIconDefault from "../../assets/images/action-icons/reel-default.svg";
import ReelsIcon from "../../assets/images/action-icons/reels.svg";

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col items-center p-4 space-y-6 bg-[#EFEFEF] rounded-[87px] h-[440px] fixed left-[28px] top-[100px]">
      <div className="h-full flex justify-between items-center flex-col">
        <button className={`p-2`}>
          <Link to="/">
            {location.pathname === '/' ? (
              <img src={HomeIcon} className="w-6 h-6 text-gray-700" />
            ) : (
              <img src={HomeIconDefault} className="w-6 h-6 text-gray-700" />
            )}
          </Link>
        </button>
        <button className={`p-2`}>
          <Link to="/explore">
            {location.pathname === '/explore' ? (
              <img src={SearchIcon} className="w-6 h-6 text-gray-700" />
            ) : (
              <img src={SearchIconDefault} className="w-6 h-6 text-gray-700" />
            )}
          </Link>
        </button>
        <button className={`p-2`}>
          <Link to='/reels'>
            {location.pathname === '/reels' ? (
              <img src={ReelsIcon} className="w-6 h-6 text-gray-700" />
            ) : (
              <img src={ReelsIconDefault} className="w-6 h-6 text-gray-700" />
            )}
          </Link>
        </button>
        <button className={`p-2`}>
          <Link to="/inbox">
            {location.pathname === '/inbox' ? (
              <img src={MsgIcon} className="w-6 h-6 text-gray-700" />
            ) : (
              <img src={MsgIconDefault} className="w-6 h-6 text-gray-700" />
            )}
          </Link>
        </button>
        <button className={`p-2`}>
          <Link to='/notifications'>
            {location.pathname === '/notifications' ? (
              <img src={LikeIcon} className="w-6 h-6 text-gray-700" />
            ) : (
              <img src={LikeIconDefault} className="w-6 h-6 text-gray-700" />
            )}
          </Link>
        </button>
        <button className={`p-2`}>
          <Link to='/profile'>
            {location.pathname === '/profile' ? (
              <img src={UserIcon} className="w-6 h-6 text-gray-700" />
            ) : (
              <img src={UserIconDefault} className="w-6 h-6 text-gray-700" />
            )}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
