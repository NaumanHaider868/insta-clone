import React from "react";

const Messages = () => {
  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-black text-white p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-500">
            {/* Profile Picture */}
          </div>
          <div>
            <p className="font-bold text-lg">naumanh_43</p>
            <p className="text-sm text-gray-400">Your note</p>
          </div>
          <button className="ml-auto">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages List */}
        <div className="flex flex-col space-y-3">
          {[
            { name: "Mian Noman", time: "5h", message: "sent an attachment" },
            { name: "Itx syco", time: "11h", message: "sent an attachment" },
            {
              name: "The Abdullah Mirza",
              time: "19h",
              message: "You sent an attachment",
            },
            {
              name: "Muhammad Ali",
              time: "23h",
              message: "sent an attachment",
            },
          ].map((msg, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded"
            >
              <div className="w-10 h-10 rounded-full bg-gray-500">
                {/* Profile Picture */}
              </div>
              <div>
                <p className="font-bold">{msg.name}</p>
                <p className="text-sm text-gray-400">
                  {msg.message} • {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">Your messages</p>
          <p className="text-gray-400 mb-6">Send a message to start a chat.</p>
          <button className="bg-blue-500 px-6 py-2 rounded-full text-white">
            Send message
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
