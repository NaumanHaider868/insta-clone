import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import user from "../../../assets/images/users-imgs/user6.jpg";
import InboxSide from "./InboxSide";
import UserChat from "./UserChat";

const MessagePage = ({ isMobile, setIsMobile }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState();

  // Fetch conversations from API
  useEffect(() => {
  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVlZmYyMmNkLTZiZTctNGYyMi1iYTQxLTI0NDdkNzdiZTE1ZCIsImVtYWlsIjoidXNlcjJAZ21haWwuY29tIiwicmVmZXJlbmNlIjoicUBGOSFyVCRNI2s3VnpCJnhAZFB1KmVZXk40VyFhWG9DMSIsImlhdCI6MTc3MjY1MTY0OSwiZXhwIjoxNzczMjU2NDQ5fQ.vGGvwSI_GMCKaPWaV4T6L9GSFsGcQqfeYFRKMFNhqx8";
      
      const response = await fetch('http://localhost:6666/chat/conversations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Uncomment and use this transformation
      if (result.data && Array.isArray(result.data)) {
        const transformedUsers = result.data.map((conversation) => ({
          id: conversation.user.id,
          name: `${conversation.user.firstName} ${conversation.user.lastName}`,
          userName: conversation.user.userName,
          image: user, // You need to define 'user' or pass it as prop
          senderImg: user,
          lastMessage: conversation.lastMessage.content,
          status: conversation.lastMessage.isRead ? "seen" : "new",
          isRead: conversation.lastMessage.isRead,
          lastMessageTime: conversation.lastMessage.createdAt,
          chats: []
        }));
        
        setUsers(transformedUsers);
      }
      
    } catch (err) {
      console.error('Error fetching conversations:', err);
      // setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchConversations();
}, [user]); // Add user to dependency array if it's from props/state

  const userInfo = (user) => {
    setSelectedUser(user);
  };

  const clearSelectedUser = () => {
    setSelectedUser(null);
  };

  return (
    <div className="inbox h-full">
      <div className="inbox-content flex items-center pt-4 pb-8 h-full">
        <div className={`bg-[#EFEFEF] dark:bg-[#ffffff1c] h-full shadow-lg rounded-3xl flex overflow-hidden w-full`}>
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
                  setSelectedUser={setSelectedUser}
                  clearSelectedUser={clearSelectedUser}
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
