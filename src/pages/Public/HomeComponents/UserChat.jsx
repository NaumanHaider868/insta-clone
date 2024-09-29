import React, { useState, useEffect, useRef } from "react";

const UserChat = ({ selectedUser, setSelectedUser, clearSelectedUser }) => {
  const [message, setMessage] = useState("");
  const [fadeInMessages, setFadeInMessages] = useState([]);
  const chatContainerRef = useRef(null);

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

    setFadeInMessages((prev) => [...prev, newMessage]);

    setMessage("");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [selectedUser?.chats]);

  useEffect(() => {
    if (fadeInMessages.length) {
      const timer = setTimeout(() => {
        setFadeInMessages([]);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [fadeInMessages]);

  return (
    <>
      {selectedUser ? (
        <div className="flex flex-col w-full">
          <div className="flex items-center">
            <button onClick={clearSelectedUser} className="mr-4">
              <i className="fas fa-arrow-left dark:text-white"></i>
            </button>
            <img
              src={selectedUser?.image}
              alt={selectedUser?.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-grow">
              <h3 className="text-lg font-bold dark:text-white">
                {selectedUser?.name}
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
            className="flex-1 overflow-y-auto py-6 px-3 thin-scrollable flex-col flex"
            ref={chatContainerRef}
          >
            {selectedUser?.chats?.map((message, index) => (
              <div className="message-container" key={index}>
                <div
                  className={`flex ${message.sender === "me" ? "justify-end float-right flex-row-reverse" : "justify-start"
                    } mb-4 transition-opacity duration-300 ease-in-out ${fadeInMessages.includes(message) ? "opacity-0" : "opacity-100"
                    }`}
                >
                  <img
                    src={message.sender === "me" ? selectedUser?.senderImg : selectedUser?.image}
                    className={`w-10 h-10 rounded-full ${message.sender === "me" ? "ml-3" : "mr-3"}`}
                  />
                  <div
                    className={`p-[8px] rounded-lg ${message.sender === "me"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 dark:bg-[#4e4e4e] text-gray-200"
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
              </div>
            ))}
          </div>

          <div className="p-4 border-t px-0 border-t-[#a5a5a58f] dark:border-t-[#ffffff26]">
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
                onClick={handleSubmitMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full m-auto">
          <h2 className="text-gray-500 text-lg dark:text-white">
            Please select a user to chat.
          </h2>
        </div>
      )}
    </>
  );
};

export default UserChat;
