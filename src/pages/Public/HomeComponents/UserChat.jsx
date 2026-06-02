import React, { useState, useEffect, useRef } from "react";
import api from "../../../utils/api";
import noUser from '../../../assets/images/no-user.png';

const UserChat = ({ selectedUser, isMobile }) => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const chatContainerRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?.id;

  const handleSubmitMessage = async () => {
    if (!message.trim() || sending) return;

    const tempId = Date.now();

    const newMessage = {
      id: tempId,
      text: message,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      isTemp: true,
    };

    setChats((prev) => [...prev, newMessage]);

    const messageToSend = message;
    setMessage("");
    setSending(true);

    try {
      const { data } = await api.post(`/chat/send`, {
        receiverId: selectedUser.id,
        content: messageToSend,
      });

      const saved = data.data;

      setChats((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? {
              id: saved.id,
              text: saved.content,
              createdAt: saved.createdAt,
              timestamp: new Date(saved.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              isMe: true,
              isTemp: false,
            }
            : msg
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setChats((prev) => prev.filter((msg) => msg.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  // FETCH CHATS
  useEffect(() => {
    const fetchChats = async () => {
      if (!selectedUser?.id) return;

      setLoading(true);

      try {
        const { data } = await api.get(
          `/chat/single/${selectedUser.id}`
        );

        const messages = Array.isArray(data)
          ? data
          : data.data || [];

        const formatted = messages.map((msg) => ({
          id: msg.id,
          text: msg.content,
          createdAt: msg.createdAt,
          isMe: msg.senderId === currentUserId,

          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),

          senderName: msg.sender?.userName,
          receiverName: msg.receiver?.userName,
        }));

        formatted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setChats(formatted);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [selectedUser?.id, currentUserId]);

  // AUTO SCROLL
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <>
      {selectedUser ? (
        <div className="flex flex-col w-full h-full">
          {/* HEADER */}
          <div className="flex items-center p-4 border-b">
            {isMobile && (
              <button className="mr-4">
                <i className="fas fa-arrow-left dark:text-white"></i>
              </button>
            )}

            <img
              src={selectedUser?.image || noUser}
              className="w-12 h-12 rounded-full mr-4"
              alt="user"
            />

            <div className="flex-grow">
              <h3 className="text-lg font-bold dark:text-white">
                {selectedUser?.name || selectedUser?.userName}
              </h3>
            </div>
          </div>

          {/* CHAT BODY */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto py-6 px-3 flex flex-col"
          >
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              chats.map((msg) => {
                const isMe = msg.isMe;
                
                return (
                  <div
                    key={msg.id}
                    className={`flex mb-4 ${isMe ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`flex items-end gap-2 max-w-xs ${isMe ? "flex-row-reverse" : "flex-row"
                        }`}
                    >
                      {/* AVATAR */}
                      <img
                        src={
                          isMe
                            ? user?.image || noUser
                            : selectedUser?.image || noUser
                        }
                        className="w-9 h-9 rounded-full"
                        alt="avatar"
                      />

                      {/* MESSAGE BOX */}
                      <div
                        className={`px-3 py-2 rounded-lg ${isMe
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-[#4e4e4e] dark:text-white"
                          } ${msg.isTemp ? "opacity-70" : ""}`}
                      >
                        <p className="text-sm">{msg.text}</p>

                        <div
                          className={`text-[10px] mt-1 opacity-70 ${isMe ? "text-right" : "text-left"
                            }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* INPUT */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Message..."
                value={message}
                className="flex-grow rounded-full px-4 py-2 border dark:bg-gray-800 dark:text-white"
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSubmitMessage()
                }
                disabled={sending}
              />

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full ml-4 disabled:opacity-50"
                onClick={handleSubmitMessage}
                disabled={sending || !message.trim()}
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <h2 className="text-gray-500 dark:text-white">
            Please select a user to chat.
          </h2>
        </div>
      )}
    </>
  );
};

export default UserChat;