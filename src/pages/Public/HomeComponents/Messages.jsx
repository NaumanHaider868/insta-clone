import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL, fetchChatConversations, getSocketOptions, getStoredSession, searchChatUsers } from "../../../services/api";
import InboxSide from "./InboxSide";
import UserChat from "./UserChat";

const toInboxUser = (user, lastMessage = null, unreadCount = 0) => {
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName || "User";
  return {
    ...user,
    name,
    image: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    lastMessage: lastMessage?.content || "Start a conversation",
    lastMessageAt: lastMessage?.createdAt || "",
    unreadCount,
    status: user.isOnline ? "online" : "offline",
  };
};

const MessagePage = ({ isMobile }) => {
  const { token, user: currentUser } = getStoredSession();
  const currentUserId = currentUser?.id;
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const selectedUserRef = useRef(null);
  const seenMessageIdsRef = useRef(new Set());

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    if (!currentUserId || !token) {
      setLoading(false);
      setError("Sign in to use messages.");
      return undefined;
    }

    let active = true;
    const client = io(API_BASE_URL, getSocketOptions(token));
    setSocket(client);

    const updateConversation = (message, incoming) => {
      if (!message?.id || seenMessageIdsRef.current.has(message.id)) return;
      seenMessageIdsRef.current.add(message.id);
      const partnerId = message.senderId === currentUserId ? message.receiverId : message.senderId;
      const partner = message.senderId === currentUserId ? message.receiver : message.sender;
      const isOpen = selectedUserRef.current?.id === partnerId;

      setUsers((currentUsers) => {
        const existing = currentUsers.find((user) => user.id === partnerId);
        const nextUser = toInboxUser(
          { ...(existing || {}), ...(partner || {}), id: partnerId },
          message,
          incoming && !isOpen ? (existing?.unreadCount || 0) + 1 : isOpen ? 0 : existing?.unreadCount || 0
        );
        return [nextUser, ...currentUsers.filter((user) => user.id !== partnerId)]
          .sort((left, right) => right.lastMessageAt.localeCompare(left.lastMessageAt));
      });
    };

    const handleReceive = (message) => updateConversation(message, true);
    const handleSent = (message) => updateConversation(message, false);
    const handlePresence = ({ userId, isOnline, lastSeen }) => {
      setUsers((currentUsers) => currentUsers.map((user) => user.id === userId
        ? { ...user, status: isOnline ? "online" : "offline", isOnline, lastSeen }
        : user));
      setSelectedUser((current) => current?.id === userId
        ? { ...current, status: isOnline ? "online" : "offline", isOnline, lastSeen }
        : current);
    };

    client.on("connect", () => setSocketConnected(true));
    client.on("disconnect", () => setSocketConnected(false));
    client.on("message:receive", handleReceive);
    client.on("message:sent", handleSent);
    client.on("user:presence", handlePresence);

    fetchChatConversations()
      .then((conversations) => {
        if (!active) return;
        setUsers((conversations || []).map(({ user, lastMessage, unreadCount }) => toInboxUser(user, lastMessage, unreadCount)));
        setError("");
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Unable to load conversations.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      client.off("message:receive", handleReceive);
      client.off("message:sent", handleSent);
      client.off("user:presence", handlePresence);
      client.disconnect();
      setSocket(null);
    };
  }, [currentUserId, token]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await searchChatUsers(query);
        if (active) setSearchResults((response?.items || []).map((user) => toInboxUser(user)));
      } catch {
        if (active) setSearchResults([]);
      } finally {
        if (active) setSearchLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  const clearSelectedUser = () => setSelectedUser(null);
  const selectUser = (user) => {
    setSelectedUser(user);
    setUsers((currentUsers) => currentUsers.map((conversation) => conversation.id === user.id
      ? { ...conversation, unreadCount: 0 }
      : conversation));
  };

  return (
    <div className="inbox h-full">
      <div className="inbox-content flex h-full items-center pb-8 pt-4">
        <div className="flex h-full w-full overflow-hidden rounded-3xl bg-[#EFEFEF] shadow-lg dark:bg-[#ffffff1c]">
          <div className={isMobile ? (selectedUser ? "hide-inbox" : "show-inbox") : ""}>
            <InboxSide
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={selectUser}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              searchLoading={searchLoading}
            />
          </div>
          <div className={`flex w-full flex-1 bg-[#EFEFEF] p-4 dark:bg-[#1C1C1C] inbox-msg ${isMobile ? (selectedUser ? "show-chat" : "hide-chat") : ""}`}>
            <UserChat
              selectedUser={selectedUser}
              currentUser={currentUser}
              socket={socket}
              socketConnected={socketConnected}
              setUsers={setUsers}
              clearSelectedUser={clearSelectedUser}
              isMobile={isMobile}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;