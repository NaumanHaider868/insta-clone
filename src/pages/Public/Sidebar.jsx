import React, { useState } from "react";
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
import ActionIcon from "../../assets/images/action-icons/action-bold.svg";
import ActionIconDefault from "../../assets/images/action-icons/action.svg";
import MsgIcon from "../../assets/images/action-icons/msg.svg";
import MsgIconDefault from "../../assets/images/action-icons/msg-default.svg";
import ReelsIconDefault from "../../assets/images/action-icons/reel-default.svg";
import ReelsIcon from "../../assets/images/action-icons/reels.svg";
import { Drawer } from "@mui/material";
import { FiSettings, FiActivity, FiBookmark, FiMoon, FiAlertCircle, FiMessageCircle, FiUser, FiLogOut } from 'react-icons/fi';
import { FiMoreVertical } from 'react-icons/fi';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Sidebar = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      time: "Today",
      profileImage: "/src/assets/images/users-imgs/user19.jpeg",
      user: 'shinkiro96',
      message: "haroonhpanezai, and 9 others liked your comment: Rich army of poor country",
      timeAgo: "8h",
      postImage: "/src/assets/images/users-imgs/user10.jpeg",
    },
    {
      id: 2,
      time: "This week",
      profileImage: "/src/assets/images/users-imgs/user12.jpeg",
      user: '_im_abdurrehman67',
      message: "and nomi_43e3 liked your story.",
      timeAgo: "1d",
      postImage: "/src/assets/images/users-imgs/user11.jpeg",
    },
    {
      id: 3,
      time: "This week",
      profileImage: "/src/assets/images/users-imgs/user14.jpeg",
      user: 'irfanbarkati4',
      message: "started following you.",
      timeAgo: "2d",
      action: "Follow",
    },
    {
      id: 4,
      time: "This month",
      profileImage: "/src/assets/images/users-imgs/user5.jpeg",
      user: 'ramzanabibi1',
      message: "who you might know, is on Instagram.",
      timeAgo: "1w",
      action: "Follow",
    },
    {
      id: 5,
      time: "This month",
      profileImage: "/src/assets/images/users-imgs/user13.jpeg",
      user: '365codingdays',
      message: "liked your comment: What should learn for backend 'python' or 'express Js'.",
      timeAgo: "1w",
    },
  ];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setIsOpen(open);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="sidebar-container fixed left-[65px] top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center h-screen">
      <div className="sidebar flex flex-col items-center p-4 space-y-6 bg-[#EFEFEF] dark:bg-[#ffffff1c] rounded-[87px] h-[440px]">
        <div className="h-full flex justify-between items-center flex-col">
          <button className={`p-2`}>
            <Link to="/">
              {location.pathname === '/' ? (
                <img src={HomeIcon} className="w-6 h-6 text-gray-700 dark:!text-white" />
              ) : (
                <img src={HomeIconDefault} className="w-6 h-6 text-gray-700 dark:!text-white" />
              )}
            </Link>
          </button>
          <button className={`p-2`}>
            <Link to="/explore">
              {location.pathname === '/explore' ? (
                <img src={SearchIcon} className="w-6 h-6 text-gray-700 dark:!text-white" />
              ) : (
                <img src={SearchIconDefault} className="w-6 h-6 text-gray-700 dark:!text-white" />
              )}
            </Link>
          </button>
          <button className={`p-2`}>
            <Link to="/reels">
              {location.pathname === '/reels' ? (
                <img src={ReelsIcon} className="w-6 h-6 text-gray-700 dark:!text-white" />
              ) : (
                <img src={ReelsIconDefault} className="w-6 h-6 text-gray-700 dark:!text-white" />
              )}
            </Link>
          </button>
          <button className={`p-2`}>
            <Link to="/inbox">
              {location.pathname === '/inbox' ? (
                <img src={MsgIcon} className="w-6 h-6 text-gray-700 dark:!text-white" />
              ) : (
                <img src={MsgIconDefault} className="w-6 h-6 text-gray-700 dark:!text-white" />
              )}
            </Link>
          </button>
          <button className={`p-2`} onClick={() => setIsOpen(true)}>
            {isOpen ? (
              <img src={LikeIcon} className="w-6 h-6 text-gray-700 dark:!text-white" />
            ) : (
              <img src={LikeIconDefault} className="w-6 h-6 text-gray-700 dark:!text-white" />
            )}
          </button>
          <button className={`p-2`}>
            <Link to="/profile">
              {location.pathname === '/profile' ? (
                <img src={UserIcon} className="w-6 h-6 text-gray-700 dark:!text-white" />
              ) : (
                <img src={UserIconDefault} className="w-6 h-6 text-gray-700 dark:!text-white" />
              )}
            </Link>
          </button>
          <button className={`p-2`}>
            <img src={open ? ActionIcon : ActionIconDefault} className="w-6 h-6 text-gray-700 dark:!text-white transform scale-x-[-1]" onClick={handleClick} />
            <Menu
              anchorEl={anchorEl}
              open={open}
              disableScrollLock={true}
              onClose={handleClose}
              className="action-dropdown"
            >
              <MenuItem onClick={handleClose} className="flex items-center space-x-2 p-3">
                <FiSettings className="text-gray-500 dark:!text-white" />
                <span className="dark:!text-white">Settings</span>
              </MenuItem>
              <MenuItem onClick={handleClose} className="flex items-center space-x-2 p-3">
                <FiActivity className="text-gray-500 dark:!text-white" />
                <span className="dark:!text-white">Your activity</span>
              </MenuItem>
              <MenuItem onClick={handleClose} className="flex items-center space-x-2 p-3">
                <FiBookmark className="text-gray-500 dark:!text-white" />
                <span className="dark:!text-white">Saved</span>
              </MenuItem>
              <MenuItem onClick={() => setDarkMode(!darkMode)} className="flex items-center space-x-2 p-3">
                <FiMoon className="text-gray-500 dark:!text-white" />
                <span className="dark:!text-white">Switch appearance</span>
              </MenuItem>
              <MenuItem onClick={handleClose} className="flex items-center space-x-2 p-3">
                <FiAlertCircle className="text-gray-500 dark:!text-white" />
                <span className="dark:!text-white">Report a problem</span>
              </MenuItem>
              <div className="border-t my-1"></div>
              <MenuItem onClick={handleClose} className="flex items-center space-x-2 p-3">
                <FiUser className="text-gray-500 dark:!text-white" />
                <span className="dark:!text-white">Switch accounts</span>
              </MenuItem>
              <MenuItem onClick={handleClose} className="flex items-center space-x-2 p-3">
                <FiLogOut className="text-gray-500 dark:!text-white" />
                <span className="dark:!text-white">Log out</span>
              </MenuItem>
            </Menu>
          </button>
        </div>
        {isOpen && (
          <Drawer
            anchor="right"
            open={isOpen}
            onClose={toggleDrawer(false)}
          >
            <div className="bg-[#EFEFEF] dark:bg-[#1C1C1C] text-black dark:text-white p-4 max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-4">Notifications</h2>

              {notifications.map((item) => (
                <div key={item.id} className="mb-6">
                  {item.id === 1 || (notifications[item.id - 2]?.time !== item.time) ? (
                    <h3 className="text-lg font-semibold mb-2">{item.time}</h3>
                  ) : null}

                  <div className="flex items-start space-x-4">
                    <div className="rounded-full w-10 h-10">
                      <img src={item.profileImage} alt="profile" className="w-full h-full" />
                    </div>

                    <div className="flex-grow">
                      <p><span className="font-bold">{item.user}</span> {item.message}</p>
                      <span className="text-gray-400 text-sm">{item.timeAgo}</span>
                    </div>

                    {item.postImage && (
                      <img src={item.postImage} alt="post" className="w-12 h-12 rounded-md" />
                    )}

                    {item.action && (
                      <button className="bg-blue-500 text-white py-1 px-4 rounded-full">
                        {item.action}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Drawer>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
