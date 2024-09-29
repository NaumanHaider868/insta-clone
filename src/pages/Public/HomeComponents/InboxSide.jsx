import React from "react";

export default function InboxSide({
  users,
  userInfo,
  selectedUser,
  setSelectedUser,
}) {
  return (
    <div className="w-[310px] p-4 inbox-side">
      <div className="flex items-center justify-between mb-4 inbox-head">
        <h2 className="text-xl font-bold dark:text-white inbox-head-text">Messages</h2>
        <div className="inbox-head-icon">
          <i className="icon"></i>
        </div>
      </div>

      <div className="relative mb-4 inbox-find">
        <input
          type="text"
          placeholder="Search"
          className="w-full py-2 pl-10 pr-4 rounded-[40px] bg-white outline-none"
        />
        <i className="msg-search-icon absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
      </div>
      <div className="h-[368px] overflow-auto overflow-x-hidden thin-scrollable pr-1 ">
        <div className="rounded-[20px]">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex rounded-lg cursor-pointer ${selectedUser?.id === user?.id ? "user-bg-active dark:bg-[#00000073]" : ""
                } !rounded-xl`}
              onClick={() => setSelectedUser(user)}
            >
              <div
                className={`flex p-[10px] w-full ${user.id !== 4 ? "border-b dark:!border-none" : ""
                  }`}
              >
                <div className="w-[57px] h-[46px] rounded-full bg-story relative inbox-user-img">
                  <img
                    className="w-full h-full rounded-full cursor-pointer p-[2px]"
                    src={user.image}
                    alt="Profile"
                  />
                  {user.status === "online" && (
                    <span className="absolute w-[12px] h-[12px] rounded-full cursor-pointer bg-[#14D41C] bottom-[0px] right-[3px]"></span>
                  )}
                </div>
                <div className="flex w-full flex-col relative inbox-user-detail">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="ml-2">
                        <h4 className="font-semibold cursor-pointer dark:text-white">
                          {user.name}
                        </h4>
                        <p
                          className={`text-[12px] ${user.status === "new"
                            ? "text-[#0095F6] font-bold"
                            : "text-gray-400 dark:text-white"
                            }`}
                        >
                          {user.lastMessage}
                        </p>
                      </div>
                    </div>
                    <i className="camera-icon"></i>
                  </div>
                  {/* {user.id !== 4 && (
                  <span className="w-[186px] absolute top-[54px] h-[0.5px] bg-[#9A9A9A]"></span>
                )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
