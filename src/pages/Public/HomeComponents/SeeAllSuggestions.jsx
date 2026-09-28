import { useEffect, useState } from "react";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchSuggestions, followUser } from "../../../services/api";

const PAGE_SIZE = 20;

const SeeAllSuggestions = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [followingId, setFollowingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchSuggestions(1, PAGE_SIZE)
      .then((response) => {
        if (!active) return;
        setUsers(response?.items || []);
        setPage(response?.pagination?.page || 1);
        setHasNextPage(Boolean(response?.pagination?.hasNextPage));
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Unable to load suggestions.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasNextPage) return;
    setLoadingMore(true);
    setError("");
    try {
      const response = await fetchSuggestions(1, PAGE_SIZE, users.length);
      setUsers((current) => [...current, ...(response?.items || [])]);
      setPage(response?.pagination?.page || page + 1);
      setHasNextPage(Boolean(response?.pagination?.hasNextPage));
    } catch (loadError) {
      setError(loadError.message || "Unable to load more suggestions.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFollow = async (userId) => {
    if (followingId) return;
    setFollowingId(userId);
    setError("");
    try {
      await followUser(userId);
      setUsers((current) => current.filter((user) => user.id !== userId));
    } catch (followError) {
      setError(followError.message || "Unable to follow this user.");
    } finally {
      setFollowingId(null);
    }
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-4xl px-4 py-8 sm:px-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
        <FaArrowLeft aria-hidden="true" /> Back to feed
      </Link>

      <header className="mb-7 mt-6 border-b border-gray-200 pb-5 dark:border-gray-700">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">Discover</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">People you can follow</h1>
      </header>

      {error && <p role="alert" className="mb-4 text-sm text-red-500">{error}</p>}
      {loading ? (
        <p className="py-10 text-center text-sm text-gray-500">Loading suggestions...</p>
      ) : users.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">No new people to follow right now.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <li key={user.id} className="flex items-center gap-3 py-4">
                <img
                  src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName || "User")}`}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user.userName}</p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">{`${user.firstName || ""} ${user.lastName || ""}`.trim()}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFollow(user.id)}
                  disabled={followingId !== null}
                  className="inline-flex shrink-0 items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  <FaUserPlus aria-hidden="true" />
                  {followingId === user.id ? "Following..." : "Follow"}
                </button>
              </li>
            ))}
          </ul>
          {hasNextPage && (
            <div className="py-6 text-center">
              <button type="button" onClick={loadMore} disabled={loadingMore} className="rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-white/10">
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default SeeAllSuggestions;