import { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { fetchStories, getStoredSession } from "../../../services/api";
import StoryComposer from "./StoryComposer";
import StoryViewer from "./StoryViewer";
import "../../../assets/css/style.scss";

const StoryRow = () => {
  const [currentUser] = useState(() => getStoredSession().user || {});
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const loadStories = useCallback(async () => {
    try {
      const response = await fetchStories();
      const receivedGroups = response?.items || [];
      const ownGroup = receivedGroups.find((group) => group.user.id === currentUser.id) || {
        user: currentUser,
        stories: [],
        isCurrentUser: true,
        hasUnseen: false,
      };
      const otherGroups = receivedGroups
        .filter((group) => group.user.id !== currentUser.id)
        .sort((left, right) => Number(right.hasUnseen) - Number(left.hasUnseen));
      setGroups([ownGroup, ...otherGroups]);
      setError("");
    } catch (loadError) {
      setGroups([{
        user: currentUser,
        stories: [],
        isCurrentUser: true,
        hasUnseen: false,
      }]);
      setError(loadError.message || "Unable to load stories.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const markViewed = useCallback((storyId) => {
    setGroups((current) => current.map((group) => {
      const stories = group.stories.map((story) => story.id === storyId ? { ...story, viewed: true } : story);
      return {
        ...group,
        stories,
        hasUnseen: stories.some((story) => !story.viewed),
      };
    }));
  }, []);

  const ownGroup = groups.find((group) => group.user.id === currentUser.id) || {
    user: currentUser,
    stories: [],
    hasUnseen: false,
  };

  return (
    <>
      <div className="story-row">
        <div className="story-me">
          <div className="story relative flex flex-col items-center">
            <button type="button" onClick={() => ownGroup.stories.length > 0 && setSelectedUserId(currentUser.id)} aria-label="View your story" className="relative">
              <div className={`story-circle ${ownGroup.hasUnseen ? "" : "story-circle-seen"}`}>
                <img src={ownGroup.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(ownGroup.user.userName || "You")}`} alt="Your profile" />
              </div>
            </button>
            <button type="button" onClick={() => setComposerOpen(true)} aria-label="Add story" title="Add story" className="add-story absolute bottom-7 right-0 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-[#0095F6] text-white dark:border-[#1d1d1d]">
              <FaPlus size={11} />
            </button>
            <span className="mt-2 max-w-[78px] truncate text-xs text-gray-700 dark:text-gray-200">Your story</span>
          </div>
        </div>

        <div className="other-users flex w-full gap-1 overflow-x-auto" aria-label="Stories from people you follow">
          {loading && <p className="px-3 py-5 text-xs text-gray-500">Loading stories...</p>}
          {!loading && groups.slice(1).map((group) => (
            <button key={group.user.id} type="button" onClick={() => setSelectedUserId(group.user.id)} className="story relative flex flex-col items-center" aria-label={`View ${group.user.userName}'s story`}>
              <div className={`story-circle ${group.hasUnseen ? "" : "story-circle-seen"}`}>
                <img src={group.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.user.userName || "User")}`} alt={`${group.user.userName}'s profile`} />
              </div>
              <span className="mt-2 max-w-[78px] truncate text-xs text-gray-700 dark:text-gray-200">{group.user.userName}</span>
            </button>
          ))}
          {!loading && !error && groups.length <= 1 && <p className="px-3 py-5 text-xs text-gray-500">No stories yet.</p>}
          {error && <p role="alert" className="px-3 py-5 text-xs text-red-500">{error}</p>}
        </div>
      </div>

      {composerOpen && <StoryComposer onClose={() => setComposerOpen(false)} onCreated={loadStories} />}
      {selectedUserId && <StoryViewer groups={groups} selectedUserId={selectedUserId} currentUserId={currentUser.id} onClose={() => setSelectedUserId(null)} onViewed={markViewed} />}
    </>
  );
};

export default StoryRow;