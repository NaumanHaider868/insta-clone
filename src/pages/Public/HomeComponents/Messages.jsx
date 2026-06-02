import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import userImg from "../../../assets/images/users-imgs/user6.jpg";
import InboxSide from "./InboxSide";
import UserChat from "./UserChat";

const MessagePage = ({ isMobile, setIsMobile }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/chat/conversations');

        if (data.data && Array.isArray(data.data)) {
          const transformedUsers = data.data.map((conversation) => ({
            id: conversation.user.id,
            name: `${conversation.user.firstName} ${conversation.user.lastName}`,
            userName: conversation.user.userName,
            image: userImg,
            senderImg: userImg,
            lastMessage: conversation.lastMessage.content,
            status: conversation.lastMessage.isRead ? "seen" : "new",
            isRead: conversation.lastMessage.isRead,
            lastMessageTime: conversation.lastMessage.createdAt,
            chats: []
          }));

          setUsers(transformedUsers);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const userInfo = (user) => {
    setSelectedUser(user);
  };

  const clearSelectedUser = () => {
    setSelectedUser(null);
  };

  return (
    <div className="inbox h-full">
      <div className="inbox-content flex items-center pt-4 pb-8 h-full">
        <div className="bg-[#EFEFEF] dark:bg-[#ffffff1c] h-full shadow-lg rounded-3xl flex overflow-hidden w-full">
          {loading ? (
            <div className="flex justify-center items-center w-full h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-white">Loading conversations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center w-full h-full">
              <div className="text-center">
                <p className="text-red-500 dark:text-red-400 mb-4">Error: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={`${isMobile ? (selectedUser ? "hide-inbox" : "show-inbox") : ''}`}>
                <InboxSide
                  users={users}
                  userInfo={userInfo}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                />
              </div>
              <div className={`flex-1 bg-[#EFEFEF] dark:bg-[#1C1C1C] p-4 flex w-full inbox-msg ${isMobile ? (selectedUser ? "show-chat" : "hide-chat") : ''}`}>
                <UserChat
                  selectedUser={selectedUser}
                  isMobile={isMobile}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagePage;