import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/style.scss";
import { Drawer } from "@mui/material";
import { FiSettings, FiActivity, FiBookmark, FiMoon, FiAlertCircle, FiUser, FiLogOut, FiPlus } from 'react-icons/fi';
import { io } from "socket.io-client";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import {
  API_BASE_URL,
  SOCKET_PATH,
  clearSession,
  fetchNotifications,
  followUser,
  getStoredSession,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/api";
import UploadModal from "./HomeComponents/UploadModal";

const notificationMessage = (type) => {
  switch (type) {
    case "FOLLOW": return "started following you.";
    case "LIKE_POST": return "liked your post.";
    case "LIKE_REEL": return "liked your reel.";
    case "COMMENT_POST": return "commented on your post.";
    case "COMMENT_REEL": return "commented on your reel.";
    case "MESSAGE": return "sent you a message.";
    default: return "sent you a notification.";
  }
};

const notificationTime = (value) => {
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (!Number.isFinite(elapsedMinutes) || elapsedMinutes < 1) return "now";
  if (elapsedMinutes < 60) return `${elapsedMinutes}m`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h`;
  const elapsedDays = Math.floor(elapsedHours / 24);
  return elapsedDays < 7 ? `${elapsedDays}d` : new Date(value).toLocaleDateString();
};

const Sidebar = ({ darkMode, setDarkMode, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { token } = getStoredSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState("");
  const [followingBack, setFollowingBack] = useState([]);

  useEffect(() => {
    if (!token) {
      setNotificationsLoading(false);
      return undefined;
    }

    let active = true;
    const socket = io(API_BASE_URL, {
      path: SOCKET_PATH,
      transports: ['websocket'],
      auth: { token },
      withCredentials: true,
    });
    const handleNewNotification = (notification) => {
      setNotifications((current) => [notification, ...current.filter((item) => item.id !== notification.id)]);
      if (!notification.isRead) setUnreadCount((count) => count + 1);
    };
    socket.on("notification:new", handleNewNotification);

    fetchNotifications(1, 50)
      .then((response) => {
        if (!active) return;
        setNotifications(response?.items || []);
        setUnreadCount(response?.unreadCount || 0);
        setNotificationsError("");
      })
      .catch((error) => {
        if (active) setNotificationsError(error.message || "Unable to load notifications.");
      })
      .finally(() => {
        if (active) setNotificationsLoading(false);
      });

    return () => {
      active = false;
      socket.off("notification:new", handleNewNotification);
      socket.disconnect();
    };
  }, [token]);
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

  const handleLogout = () => {
    clearSession();
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  };

  const handleMarkRead = async (notification) => {
    if (notification.isRead) return;
    setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, isRead: true } : item));
    setUnreadCount((count) => Math.max(0, count - 1));
    try {
      await markNotificationRead(notification.id);
    } catch (error) {
      setNotificationsError(error.message || "Unable to mark notification as read.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      setNotificationsError(error.message || "Unable to mark notifications as read.");
    }
  };

  const handleFollowBack = async (actorId) => {
    try {
      await followUser(actorId);
      setFollowingBack((current) => [...new Set([...current, actorId])]);
    } catch (error) {
      setNotificationsError(error.message || "Unable to follow this user.");
    }
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
          <button
            type="button"
            title="Create post or reel"
            aria-label="Create post or reel"
            className="rounded-full p-2 text-gray-700 transition hover:bg-white dark:text-white dark:hover:bg-white/10"
            onClick={() => setIsUploadOpen(true)}
          >
            <FiPlus size={24} />
          </button>
          <button type="button" className="relative p-2" onClick={() => setIsOpen(true)} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} title="Notifications">
            <img src={isOpen ? LikeIcon : LikeIconDefault} className="h-6 w-6 text-gray-700 dark:!text-white" />
            {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
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
          <div className="relative">
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
                <MenuItem onClick={handleLogout} className="flex items-center space-x-2 p-3">
                  <FiLogOut className="text-gray-500 dark:!text-white" />
                  <span className="dark:!text-white">Log out</span>
                </MenuItem>
              </Menu>
            </button>
          </div>
        </div>
        {isOpen && (
          <Drawer
            anchor="right"
            open={isOpen}
            onClose={toggleDrawer(false)}
            className="notification-drawer-w"
          >
            <div className="text-black dark:text-white p-4 notification-sideDrawer mx-auto">
              <div className="mb-4 flex items-center justify-between">
                {isMobile && (
                  <button className="mr-4" onClick={toggleDrawer(false)}>
                    <i className="fas fa-arrow-left dark:text-white"></i>
                  </button>
                )}
                <h2 className="text-2xl font-bold">Notifications</h2>
                {unreadCount > 0 && <button type="button" onClick={handleMarkAllRead} className="text-sm font-semibold text-blue-600 dark:text-blue-400">Mark all read</button>}
              </div>
              {notificationsError && <p role="alert" className="mb-3 text-sm text-red-500">{notificationsError}</p>}
              {notificationsLoading ? (
                <p className="py-8 text-center text-sm text-gray-500">Loading notifications...</p>
              ) : notifications.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">You have no notifications yet.</p>
              ) : notifications.map((item) => (
                <div key={item.id} className={`mb-2 flex items-start gap-3 rounded-lg p-3 ${item.isRead ? "" : "bg-blue-50 dark:bg-white/5"}`}>
                  <button type="button" onClick={() => handleMarkRead(item)} className="flex min-w-0 flex-1 items-start gap-3 text-left">
                    <img src={item.actor?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.actor?.userName || "User")}`} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm"><strong>{item.actor?.userName || "Someone"}</strong> {notificationMessage(item.type)}</span>
                      <span className="mt-1 block text-xs text-gray-500">{notificationTime(item.createdAt)}</span>
                    </span>
                    {!item.isRead && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-label="Unread" />}
                  </button>
                  {item.type === "FOLLOW" && (
                    <button type="button" onClick={() => handleFollowBack(item.actorId)} disabled={followingBack.includes(item.actorId)} className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:bg-gray-400">
                      {followingBack.includes(item.actorId) ? "Following" : "Follow back"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Drawer>
        )}
      </div>
      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} />}
    </div>
  );
};

export default Sidebar;
