import React, { useState, useEffect, useRef } from "react";
import user1 from "../../../assets/images/users-imgs/user17.jpeg"; // Assuming user image path

const ChatPage = ({ selectedUser, setSelectedUser }) => {
  const [message, setMessage] = useState("");
  const [fadeInMessages, setFadeInMessages] = useState([]); // Tracks messages for fade-in effect
  const chatContainerRef = useRef(null); // Reference for the chat container

  const handleSubmitMessage = () => {
    const newMessage = {
      sender: "me",
      text: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setSelectedUser((prevSelectedUser) => ({
      ...prevSelectedUser,
      chats: [...prevSelectedUser.chats, newMessage],
    }));

    // Add new message to fade-in effect array
    setFadeInMessages((prev) => [...prev, newMessage]);

    setMessage("");
  };

  useEffect(() => {
    // Scroll to bottom when new message is added or chats change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [selectedUser?.chats]);

  useEffect(() => {
    if (fadeInMessages.length) {
      // Remove fade effect after some time
      const timer = setTimeout(() => {
        setFadeInMessages([]);
      }, 300); // Time duration for transition

      return () => clearTimeout(timer);
    }
  }, [fadeInMessages]);

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center">
        <img
          src={selectedUser?.image || user1} // Use selectedUser image
          alt={selectedUser?.name}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div className="flex-grow">
          <h3 className="text-lg font-bold">{selectedUser?.name}</h3>{" "}
          {/* Display user's name */}
        </div>
        <div className="flex space-x-3">
          <button className="">
            <i className="fas fa-phone-alt"></i>
          </button>
          <button className="">
            <i className="fas fa-video"></i>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-6 thin-scrollable"
        ref={chatContainerRef} // Reference to the chat container
      >
        {selectedUser?.chats?.map((message, index) => (
          <div
            key={index} // Assuming chat messages are in order, using index for key
            className={`flex ${
              message.sender === "me" ? "justify-end" : "justify-start"
            } mb-4 transition-opacity duration-300 ease-in-out ${
              fadeInMessages.includes(message) ? "opacity-0" : "opacity-100"
            }`}
          >
            {message.sender !== "me" && (
              <img
                src={selectedUser?.image || user1} // Use selectedUser image
                alt={selectedUser?.name}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div
              className={`p-3 rounded-lg ${
                message.sender === "me"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-200"
              } max-w-xs`}
            >
              <p>{message.text}</p>
              {message.timestamp && (
                <span className="text-xs text-white block mt-1">
                  {message.timestamp}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Message..."
            value={message}
            className="flex-grow rounded-full px-4 py-2 focus:outline-none mr-4"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
            onClick={() => handleSubmitMessage()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
