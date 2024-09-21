import React, { useState } from "react";
import user1 from "../../../assets/images/users-imgs/user18.jpeg";
import user2 from "../../../assets/images/users-imgs/user12.jpeg";
import user3 from "../../../assets/images/users-imgs/user17.jpeg";
import user4 from "../../../assets/images/users-imgs/user13.jpeg";
import InboxSide from "./InboxSide";
import UserChat from "./UserChat";

const MessagePage = () => {
  const [users] = useState([
    {
      id: 1,
      name: "Eman",
      image: user4,
      lastMessage: "2 new messages",
      status: "new",
      chats: [
        { sender: "me", text: "Hey Eman, how are you?", timestamp: "10:01 AM" },
        {
          sender: "Eman",
          text: "I'm good! What about you?",
          timestamp: "10:02 AM",
        },
        { sender: "me", text: "Doing well, thanks!", timestamp: "10:05 AM" },
      ],
    },
    {
      id: 2,
      name: "Zain",
      image: user2,
      lastMessage: "Sent 1m ago",
      status: "sent",
      chats: [
        {
          sender: "me",
          text: "Hey Zain, did you finish the project?",
          timestamp: "9:00 AM",
        },
        {
          sender: "Zain",
          text: "Almost done, just need some final touches.",
          timestamp: "9:05 AM",
        },
      ],
    },
    {
      id: 3,
      name: "Noman Rashid",
      image: user3,
      lastMessage: "Sent 1m ago",
      status: "online",
      chats: [
        {
          sender: "me",
          text: "Noman, are you free for a quick call?",
          timestamp: "11:30 AM",
        },
        {
          sender: "Noman",
          text: "Sure, let's do it in 10 minutes.",
          timestamp: "11:35 AM",
        },
      ],
    },
    {
      id: 4,
      name: "Ali Haider",
      image: user1,
      lastMessage: "Seen",
      status: "seen",
      chats: [
        {
          sender: "me",
          text: "Hey Ali, long time no see!",
          timestamp: "8:45 AM",
        },
        {
          sender: "Ali",
          text: "Yeah, it's been a while. How's everything?",
          timestamp: "8:50 AM",
        },
        { sender: "me", text: "All good here!", timestamp: "8:55 AM" },
      ],
    },
  ]);

  const [selectedUser, setSelectedUser] = useState();

  const userInfo = (user) => {
    // console.log(user);
    setSelectedUser(user);
  };
  return (
    <div className="inbox h-full">
      <div className="flex items-center pt-4 pb-8 pl-32 h-full">
        <div className="bg-[#EFEFEF] h-full shadow-lg rounded-3xl flex overflow-hidden w-full mr-10">
          <InboxSide
            users={users}
            userInfo={userInfo}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
          <div className="flex-1 bg-[#EFEFEF] p-4 flex w-full">
            <UserChat
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
