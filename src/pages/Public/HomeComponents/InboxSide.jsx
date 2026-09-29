
const InboxUserRow = ({ user, selected, onClick, showUnread = true }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full rounded-xl text-left transition hover:bg-black/5 dark:hover:bg-white/5 ${selected ? "user-bg-active dark:bg-[#00000073]" : ""}`}
  >
    <div className="flex w-full items-center border-b p-[10px] dark:border-white/10">
      <div className="relative h-[46px] w-[46px] shrink-0 rounded-full bg-story inbox-user-img">
        <img className="h-full w-full rounded-full object-cover p-[2px]" src={user.image} alt="" />
        {user.status === "online" && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#14D41C] dark:border-[#1c1c1c]" />}
      </div>
      <div className="ml-3 min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="truncate font-semibold dark:text-white">{user.name}</h4>
          {showUnread && user.unreadCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white">{user.unreadCount}</span>}
        </div>
        <p className={`truncate text-xs ${user.unreadCount > 0 ? "font-bold text-blue-600" : "text-gray-500 dark:text-gray-300"}`}>
          {user.lastMessage || "Start a conversation"}
        </p>
      </div>
    </div>
  </button>
);

export default function InboxSide({
  users,
  selectedUser,
  setSelectedUser,
  searchQuery,
  setSearchQuery,
  searchResults,
  searchLoading,
}) {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(normalizedQuery));
  const conversationIds = new Set(users.map((user) => user.id));
  const newPeople = searchResults.filter((user) => !conversationIds.has(user.id));

  return (
    <div className="w-[310px] p-4 inbox-side">
      <div className="inbox-head mb-4 flex items-center justify-between">
        <h2 className="inbox-head-text text-xl font-bold dark:text-white">Messages</h2>
        <div className="inbox-head-icon"><i className="icon" /></div>
      </div>

      <div className="inbox-find relative mb-4">
        <input
          type="search"
          placeholder="Search people or chats"
          className="w-full rounded-[40px] bg-white py-2 pl-10 pr-4 outline-none dark:bg-[#111] dark:text-white"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <i className="msg-search-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      <div className="thin-scrollable h-[368px] overflow-auto overflow-x-hidden pr-1">
        {normalizedQuery.length >= 2 && (
          <section className="mb-3">
            <h3 className="px-2 py-2 text-xs font-semibold uppercase text-gray-500">Start a conversation</h3>
            {searchLoading && <p className="px-2 py-2 text-sm text-gray-500">Searching...</p>}
            {!searchLoading && newPeople.map((person) => (
              <InboxUserRow key={`person-${person.id}`} user={person} selected={selectedUser?.id === person.id} showUnread={false} onClick={() => setSelectedUser(person)} />
            ))}
            {!searchLoading && newPeople.length === 0 && <p className="px-2 py-2 text-xs text-gray-500">No new people found.</p>}
          </section>
        )}

        <section>
          <h3 className="px-2 py-2 text-xs font-semibold uppercase text-gray-500">Your conversations</h3>
          {filteredUsers.map((user) => (
            <InboxUserRow key={user.id} user={user} selected={selectedUser?.id === user.id} onClick={() => setSelectedUser(user)} />
          ))}
          {filteredUsers.length === 0 && <p className="py-6 text-center text-sm text-gray-500 dark:text-white">{users.length ? "No matching chats" : "No conversations yet"}</p>}
        </section>
      </div>
    </div>
  );
}