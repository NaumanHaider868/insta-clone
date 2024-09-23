import React from "react";
import { ReactComponent as SearchIcon } from "../../assets/images/action-icons/search-default.svg";
import { ReactComponent as HomeIcon } from "../../assets/images/action-icons/home-default.svg";
import { ReactComponent as LikeIcon } from "../../assets/images/action-icons/like-default.svg";
import { ReactComponent as UserIcon } from "../../assets/images/action-icons/user-default.svg";
import { ReactComponent as MsgIcon } from "../../assets/images/action-icons/msg-default.svg";
import { ReactComponent as ReelsIcon } from "../../assets/images/action-icons/reel-default.svg";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex flex-col items-center p-4 space-y-6 bg-[#EFEFEF] rounded-[87px] h-[440px] fixed left-[28px] top-[100px]">
      <div className="h-full flex justify-between items-center flex-col">
        <button className="p-2">
          <Link to="/">
            <HomeIcon className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
        <button className="p-2">
          <Link to="/explore">
            <SearchIcon className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
        <button className="p-2">
          <ReelsIcon className="w-6 h-6 text-gray-700" />
        </button>
        <button className="p-2">
          <Link to="/inbox">
            <MsgIcon className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
        <button className="p-2">
          <LikeIcon className="w-6 h-6 text-gray-700" />
        </button>
        <button className="p-2">
          <Link to="/profile">
            <UserIcon className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
