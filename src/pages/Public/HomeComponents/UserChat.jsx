import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaCheck, FaCheckDouble, FaPaperPlane } from "react-icons/fa";
import { fetchChatConversation, sendChatMessage } from "../../../services/api";

const formatTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatLastSeen = (value) => {
  if (!value) return "Offline";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Offline";
  return `Last seen ${date.toLocaleDateString([], { month: "short", day: "numeric" })}`;
};

const UserChat = ({
  selectedUser,
  currentUser,
  socket,
  socketConnected,
  clearSelectedUser,
  isMobile,
  loading: conversationsLoading,
  error: conversationsError,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState("");
  const [typing, setTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingSentRef = useRef(false);

  useEffect(() => {
    if (!selectedUser?.id) {
      setMessages([]);
      return undefined;
    }

    let active = true;
    setMessages([]);
    setMessagesLoading(true);
    setChatError("");

    fetchChatConversation(selectedUser.id)
      .then((conversation) => {
        if (!active) return;
        setMessages(conversation || []);
        if (socketConnected && socket && document.visibilityState === "visible" && document.hasFocus()) {
          socket.emit("message:read", { senderId: selectedUser.id });
        }
      })
      .catch((loadError) => {
        if (active) setChatError(loadError.message || "Unable to load this conversation.");
      })
      .finally(() => {
        if (active) setMessagesLoading(false);
      });

    return () => { active = false; };
  }, [selectedUser?.id, socket, socketConnected]);

  useEffect(() => {
    if (!socket || !selectedUser?.id || !socketConnected) return undefined;
    const partnerId = selectedUser.id;
    socket.emit("conversation:enter", { partnerId });
    const markConversationRead = () => {
      if (document.visibilityState === "visible" && document.hasFocus()) {
        socket.emit("message:read", { senderId: partnerId });
      }
    };

    const handleMessage = (incoming) => {
      if (incoming.receiverId !== currentUser?.id || incoming.senderId !== partnerId) return;
      setMessages((current) => current.some((item) => item.id === incoming.id) ? current : [...current, incoming]);
      markConversationRead();
    };
    const handleTypingStart = ({ senderId }) => {
      if (senderId === partnerId) setTyping(true);
    };
    const handleTypingStop = ({ senderId }) => {
      if (senderId === partnerId) setTyping(false);
    };
    const handleRead = ({ readBy: readerId, conversationPartnerId }) => {
      if (readerId !== partnerId || conversationPartnerId !== currentUser?.id) return;
      setMessages((current) => current.map((message) => (
        message.senderId === currentUser?.id && message.receiverId === partnerId
          ? { ...message, isRead: true }
          : message
      )));
    };
    const handleDelivered = ({ messageId, receiverId }) => {
      if (receiverId !== partnerId) return;
      setMessages((current) => current.map((message) => (
        message.id === messageId ? { ...message, isReceived: true } : message
      )));
    };

    socket.on("message:receive", handleMessage);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);
    socket.on("message:read", handleRead);
    socket.on("message:delivered", handleDelivered);
    document.addEventListener("visibilitychange", markConversationRead);
    window.addEventListener("focus", markConversationRead);

    return () => {
      socket.emit("conversation:leave");
      socket.off("message:receive", handleMessage);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      socket.off("message:read", handleRead);
      socket.off("message:delivered", handleDelivered);
      document.removeEventListener("visibilitychange", markConversationRead);
      window.removeEventListener("focus", markConversationRead);
      setTyping(false);
    };
  }, [socket, socketConnected, selectedUser?.id, currentUser?.id]);

  useEffect(() => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => () => window.clearTimeout(typingTimeoutRef.current), []);

  const handleMessageChange = (event) => {
    const nextMessage = event.target.value;
    setMessage(nextMessage);
    if (!selectedUser || !socketConnected || !socket) return;

    if (nextMessage.trim() && !typingSentRef.current) {
      typingSentRef.current = true;
      socket.emit("typing:start", { receiverId: selectedUser.id });
    }
    window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      if (typingSentRef.current) socket.emit("typing:stop", { receiverId: selectedUser.id });
      typingSentRef.current = false;
    }, 900);
  };

  const stopTyping = () => {
    window.clearTimeout(typingTimeoutRef.current);
    if (typingSentRef.current && socketConnected && socket && selectedUser) {
      socket.emit("typing:stop", { receiverId: selectedUser.id });
    }
    typingSentRef.current = false;
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    const content = message.trim();
    if (!selectedUser || !content || sending) return;

    setSending(true);
    setChatError("");
    stopTyping();
    try {
      let sentMessage;
      if (socketConnected && socket) {
        sentMessage = await new Promise((resolve, reject) => {
          socket.timeout(10000).emit("message:send", { receiverId: selectedUser.id, content }, (timeoutError, response) => {
            if (timeoutError) return reject(new Error("Message send timed out. Please try again."));
            if (response?.status !== "success") return reject(new Error(response?.message || "Unable to send message."));
            resolve(response.data);
          });
        });
      } else {
        sentMessage = await sendChatMessage({ receiverId: selectedUser.id, content });
      }
      setMessages((current) => current.some((item) => item.id === sentMessage.id) ? current : [...current, sentMessage]);
      setMessage("");
    } catch (sendError) {
      setChatError(sendError.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="m-auto flex h-full items-center justify-center text-center">
        <div>
          <h2 className="text-lg text-gray-500 dark:text-white">
            {conversationsLoading ? "Loading conversations..." : "Select a conversation or search for someone to message."}
          </h2>
          {conversationsError && <p className="mt-2 text-sm text-red-500">{conversationsError}</p>}
        </div>
      </div>
    );
  }

  const avatar = selectedUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name || "User")}`;

  return (
    <div className="flex w-full min-w-0 flex-col">
      <header className="flex shrink-0 items-center border-b border-[#a5a5a58f] pb-3 dark:border-[#ffffff26]">
        {isMobile && <button type="button" onClick={clearSelectedUser} aria-label="Back to conversations" className="mr-3 dark:text-white"><FaArrowLeft /></button>}
        <img src={avatar} alt="" className="mr-3 h-12 w-12 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold dark:text-white">{selectedUser.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-300">{selectedUser.status === "online" ? "Active now" : formatLastSeen(selectedUser.lastSeen)}</p>
        </div>
        <span className={`ml-3 h-2.5 w-2.5 rounded-full ${socketConnected ? "bg-green-500" : "bg-gray-400"}`} title={socketConnected ? "Connected" : "Reconnecting"} />
      </header>

      <div ref={chatContainerRef} className="thin-scrollable flex flex-1 flex-col overflow-y-auto px-2 py-6">
        {messagesLoading && <p className="m-auto text-sm text-gray-500">Loading messages...</p>}
        {!messagesLoading && messages.length === 0 && <p className="m-auto text-sm text-gray-500">Start the conversation with {selectedUser.name}.</p>}
        {messages.map((chatMessage, index) => {
          const isMine = chatMessage.senderId === currentUser?.id;
          return (
            <div key={chatMessage.id} className={`mb-3 flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
              {!isMine && <img src={chatMessage.sender?.profileImage || avatar} alt="" className="mr-2 mt-auto h-8 w-8 rounded-full object-cover" />}
              <div className={`max-w-[min(75%,32rem)] break-words rounded-2xl px-3 py-2 ${isMine ? "rounded-br-md bg-blue-500 text-white" : "rounded-bl-md bg-white text-gray-900 dark:bg-[#3a3a3a] dark:text-white"}`}>
                <p className="whitespace-pre-wrap text-sm">{chatMessage.content}</p>
                <div className={`mt-1 flex items-center gap-1 text-[10px] ${isMine ? "justify-end text-blue-100" : "text-gray-500 dark:text-gray-300"}`}>
                  <span>{formatTime(chatMessage.createdAt)}</span>
                  {isMine && (chatMessage.isRead
                    ? <FaCheckDouble className="text-red-400" title="Seen" />
                    : chatMessage.isReceived
                      ? <FaCheckDouble className="text-blue-100" title="Delivered" />
                      : <FaCheck className="text-gray-300" title="Sent" />)}
                </div>
              </div>
            </div>
          );
        })}
        {typing && <p className="mb-2 ml-10 text-xs text-gray-500">{selectedUser.name} is typing...</p>}
      </div>

      {chatError && <p className="mb-2 text-xs text-red-500">{chatError}</p>}
      <form onSubmit={handleSubmitMessage} className="shrink-0 border-t border-[#a5a5a58f] px-0 pt-3 dark:border-[#ffffff26]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Message..."
            value={message}
            maxLength={1000}
            className="mr-2 min-w-0 flex-grow rounded-full px-4 py-2 outline-none dark:bg-[#2a2a2a] dark:text-white"
            onChange={handleMessageChange}
            onBlur={stopTyping}
          />
          <button type="submit" aria-label="Send message" disabled={!message.trim() || sending} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-500 text-white transition hover:bg-blue-600 disabled:opacity-50">
            <FaPaperPlane />
          </button>
        </div>
        <p className="mt-1 pr-1 text-right text-[10px] text-gray-400">{message.length}/1000</p>
      </form>
    </div>
  );
};

export default UserChat;