import React from "react";
import SearchIcon from "../../assets/images/action-icons/search.svg";
import HomeIcon from "../../assets/images/action-icons/home.svg";
import LikeIcon from "../../assets/images/action-icons/like.svg";
import UserIcon from "../../assets/images/action-icons/user.svg";
import MsgIcon from "../../assets/images/action-icons/msg.svg";
import ReelsIcon from "../../assets/images/action-icons/reels.svg";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex flex-col items-center p-4 space-y-6 bg-[#EFEFEF] rounded-[87px] h-[440px] fixed left-[28px] top-[100px]">
      <div className="h-full flex justify-between items-center flex-col">
        <button className="p-2">
          <Link to="/">
            <img src={HomeIcon} className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
        <button className="p-2">
          <Link to="/explore">
            <img src={SearchIcon} className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
        <button className="p-2">
          <img src={ReelsIcon} className="w-6 h-6 text-gray-700" />
        </button>
        <button className="p-2">
          <Link to="/inbox">
            <img src={MsgIcon} className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
        <button className="p-2">
          <img src={LikeIcon} className="w-6 h-6 text-gray-700" />
        </button>
        <button className="p-2">
          <img src={UserIcon} className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
