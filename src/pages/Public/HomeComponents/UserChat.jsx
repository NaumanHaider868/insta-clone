import React, { useState, useEffect, useRef } from "react";
import api from "../../../utils/api";

const UserChat = ({ selectedUser, isMobile, currentUser }) => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const chatContainerRef = useRef(null);

  const handleSubmitMessage = async () => {
    if (!message.trim() || sending) return;

    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      sender: "me",
      text: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isTemp: true,
    };

    setChats((prev) => [...prev, newMessage]);
    setMessage("");
    setSending(true);

    try {
      // Send to backend - adjust endpoint as needed
      const { data } = await api.post(`/chat/send`, {
        receiverId: selectedUser.id,
        content: message,
      });
      
      // Replace temp message with real one
      setChats((prev) => 
        prev.map((msg) => 
          msg.id === tempId 
            ? {
                id: data.data.id,
                sender: "me",
                text: data.data.content,
                timestamp: new Date(data.data.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                isTemp: false,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setChats((prev) => prev.filter((msg) => msg.id !== tempId));
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Fetch chats when selectedUser changes
  useEffect(() => {
    const fetchChats = async () => {
      if (!selectedUser?.id) return;

      setLoading(true);
      try {
        const { data } = await api.get(`/chat/single/${selectedUser.id}`);
        
        // Data is directly the array of messages
        const messages = Array.isArray(data) ? data : data.data || [];
        
        const fetchedChats = messages.map((msg) => ({
          id: msg.id,
          // Compare senderId with current user's ID to determine if I sent it
          sender: msg.senderId === currentUser?.id ? "me" : "them",
          text: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          // Optional: store sender/receiver info if needed
          senderName: msg.sender?.userName,
          receiverName: msg.receiver?.userName,
        }));
        
        // Sort by createdAt to ensure correct order
        fetchedChats.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setChats(fetchedChats);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [selectedUser?.id, currentUser?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <>
      {selectedUser ? (
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center p-4 border-b">
            {isMobile && (
              <button className="mr-4">
                <i className="fas fa-arrow-left dark:text-white"></i>
              </button>
            )}
            <img
              src={selectedUser?.image || "/default-avatar.png"}
              alt={selectedUser?.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-grow">
              <h3 className="text-lg font-bold dark:text-white">
                {selectedUser?.name || selectedUser?.userName}
              </h3>
            </div>
            <div className="flex space-x-3">
              <button className="dark:text-white">
                <i className="fas fa-phone-alt"></i>
              </button>
              <button className="dark:text-white">
                <i className="fas fa-video"></i>
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto py-6 px-3 thin-scrollable flex flex-col"
            ref={chatContainerRef}
          >
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              chats.map((message) => (
                <div className="message-container" key={message.id}>
                  <div
                    className={`flex ${message.sender === "me" ? "justify-end flex-row-reverse" : "justify-start"} mb-4`}
                  >
                    <img
                      src={
                        message.sender === "me" 
                          ? currentUser?.image 
                          : selectedUser?.image
                      }
                      className={`w-10 h-10 rounded-full ${message.sender === "me" ? "ml-3" : "mr-3"}`}
                      alt="avatar"
                    />
                    <div
                      className={`p-[8px] rounded-lg ${
                        message.sender === "me"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-[#4e4e4e] dark:text-gray-200"
                      } max-w-xs ${message.isTemp ? "opacity-70" : ""}`}
                    >
                      <p>{message.text}</p>
                      {message.timestamp && (
                        <span className="text-xs opacity-75 block mt-1">
                          {message.timestamp}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Message..."
                value={message}
                className="flex-grow rounded-full px-4 py-2 focus:outline-none border dark:bg-gray-800 dark:text-white"
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmitMessage()}
                disabled={sending}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full ml-4 disabled:opacity-50"
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
          <h2 className="text-gray-500 text-lg dark:text-white">
            Please select a user to chat.
          </h2>
        </div>
      )}
    </>
  );
};

export default UserChat;