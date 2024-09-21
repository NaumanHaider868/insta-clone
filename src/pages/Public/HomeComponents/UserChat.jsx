import React from "react";
import user1 from "../../../assets/images/users-imgs/user17.jpeg";
const ChatPage = () => {
  const messages = [
    {
      id: 1,
      sender: "Ali",
      text: "Kal ka meeting discussion clear hai ya phr kuch confusing lag raha?",
      time: "20/09/2024, 09:30",
      fromMe: false,
    },
    {
      id: 2,
      sender: "Nauman",
      text: "Haan thoda API integration ka part unclear tha, wo server se response delay issue kaise fix kareinge?",
      time: "20/09/2024, 09:32",
      fromMe: true,
    },
    {
      id: 3,
      sender: "Ali",
      text: "Acha, wo toh backend ka thoda masla lag raha tha. Backend team ko batana hoga.",
      time: "20/09/2024, 09:35",
      fromMe: false,
    },
    {
      id: 4,
      sender: "Nauman",
      text: "Chalo theek hai, main Ahmed ko ping karta hoon. Tum ne us project ki UI finish kar di?",
      time: "20/09/2024, 09:40",
      fromMe: true,
    },
    {
      id: 5,
      sender: "Ali",
      text: "Haan bas final touches de raha hoon Tailwind ke sath, kuch styling improvements bachi hain.",
      time: "20/09/2024, 09:42",
      fromMe: false,
    },
    {
      id: 6,
      sender: "Nauman",
      text: "Perfect! Aaj shaam tak final karna hai warna client se feedback late ho jayega.",
      time: "20/09/2024, 09:45",
      fromMe: true,
    },
    {
      id: 7,
      sender: "Ali",
      text: "Haan, deadline ka dhyan hai. Milte hain lunch ke baad call pe!",
      time: "20/09/2024, 09:50",
      fromMe: false,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center">
        <img src={user1} alt="Zain" className="w-12 h-12 rounded-full mr-4" />
        <div className="flex-grow">
          <h3 className="text-lg font-bold">Noman Rashid</h3>
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
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.fromMe ? "justify-end" : "justify-start"
            } mb-4`}
          >
            {!message.fromMe && (
              <img
                src={user1}
                alt="Zain"
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div
              className={`p-3 rounded-lg ${
                message.fromMe
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-200"
              } max-w-xs`}
            >
              <p>{message.text}</p>
              {message.time && (
                <span className="text-xs text-white block mt-1">
                  {message.time}
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
            className="flex-grow rounded-full px-4 py-2 focus:outline-none mr-4"
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
