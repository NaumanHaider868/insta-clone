import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaEye, FaTimes } from "react-icons/fa";
import { fetchStoryViewers, markStoryViewed } from "../../../services/api";

const StoryViewer = ({ groups, selectedUserId, currentUserId, onClose, onViewed }) => {
  const viewableGroups = useMemo(() => groups.filter((group) => group.stories.length > 0), [groups]);
  const [groupIndex, setGroupIndex] = useState(() => Math.max(0, viewableGroups.findIndex((group) => group.user.id === selectedUserId)));
  const [storyIndex, setStoryIndex] = useState(0);
  const [viewers, setViewers] = useState([]);
  const [viewersOpen, setViewersOpen] = useState(false);
  const [viewersLoading, setViewersLoading] = useState(false);
  const [viewersError, setViewersError] = useState("");

  const group = viewableGroups[groupIndex];
  const story = group?.stories[storyIndex];
  const storyId = story?.id;
  const isOwner = group?.user.id === currentUserId;

  useEffect(() => {
    if (!storyId || isOwner) return;
    markStoryViewed(storyId).then(() => onViewed(storyId)).catch(() => {});
  }, [isOwner, onViewed, storyId]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const move = (direction) => {
    if (!group || !story) return;
    setViewersOpen(false);
    setViewers([]);
    setViewersError("");
    if (direction > 0) {
      if (storyIndex < group.stories.length - 1) {
        setStoryIndex((current) => current + 1);
      } else if (groupIndex < viewableGroups.length - 1) {
        setGroupIndex((current) => current + 1);
        setStoryIndex(0);
      } else {
        onClose();
      }
    } else if (storyIndex > 0) {
      setStoryIndex((current) => current - 1);
    } else if (groupIndex > 0) {
      const previousGroup = viewableGroups[groupIndex - 1];
      setGroupIndex((current) => current - 1);
      setStoryIndex(previousGroup.stories.length - 1);
    }
  };

  const showViewers = async () => {
    if (!story || !isOwner) return;
    setViewersOpen((open) => !open);
    if (viewers.length || viewersLoading) return;
    setViewersLoading(true);
    setViewersError("");
    try {
      const response = await fetchStoryViewers(story.id);
      setViewers(response?.items || []);
    } catch (error) {
      setViewersError(error.message || "Unable to load viewers.");
    } finally {
      setViewersLoading(false);
    }
  };

  if (!story || !group) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/90 p-3 sm:p-6" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-label={`${group.user.userName}'s story`} onMouseDown={(event) => event.stopPropagation()} className="relative flex h-[min(820px,92vh)] w-full max-w-[460px] flex-col overflow-hidden rounded-xl bg-black text-white shadow-2xl">
        <div className="absolute inset-x-0 top-0 z-20 p-3">
          <div className="mb-3 flex gap-1">
            {group.stories.map((item, index) => (
              <span key={item.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/35">
                <span className={`block h-full ${index < storyIndex ? "w-full" : index === storyIndex ? "w-1/2" : "w-0"} bg-white`} />
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <img src={group.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.user.userName || "User")}`} alt="" className="h-9 w-9 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{group.user.userName}</p>
              <p className="text-xs text-white/70">{new Date(story.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
            </div>
            {isOwner && (
              <button type="button" onClick={showViewers} className="mr-2 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-2 text-xs font-semibold" aria-label={`${story.viewCount || 0} story views`}>
                <FaEye /> {story.viewCount || 0}
              </button>
            )}
            <button type="button" onClick={onClose} aria-label="Close stories" className="rounded-full bg-black/30 p-2"><FaTimes /></button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center" style={story.type === "TEXT" ? { backgroundColor: story.background || "#1e3a8a" } : undefined}>
          {story.type === "IMAGE" && <img src={story.mediaUrl} alt="Story" className="h-full w-full object-contain" />}
          {story.type === "VIDEO" && <video src={story.mediaUrl} autoPlay controls playsInline className="h-full w-full object-contain" />}
          {story.type === "TEXT" && <p className="whitespace-pre-wrap break-words px-10 text-center text-2xl font-semibold">{story.text}</p>}
        </div>

        {story.text && story.type !== "TEXT" && <p className="absolute inset-x-0 bottom-14 bg-gradient-to-t from-black/80 to-transparent px-6 pb-5 pt-12 text-center text-base">{story.text}</p>}
        <button type="button" onClick={() => move(-1)} aria-label="Previous story" className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/35 p-2"><FaChevronLeft /></button>
        <button type="button" onClick={() => move(1)} aria-label="Next story" className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/35 p-2"><FaChevronRight /></button>

        {viewersOpen && isOwner && (
          <div className="absolute inset-x-0 bottom-0 z-30 max-h-[45%] overflow-y-auto rounded-t-xl bg-white p-4 text-gray-900 dark:bg-[#1d1d1d] dark:text-white">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Viewed by</h2>
              <button type="button" onClick={() => setViewersOpen(false)} aria-label="Close viewers" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"><FaTimes /></button>
            </div>
            {viewersError && <p role="alert" className="mb-2 text-sm text-red-500">{viewersError}</p>}
            {viewersLoading ? <p className="py-4 text-center text-sm text-gray-500">Loading viewers...</p> : viewers.length === 0 ? <p className="py-4 text-center text-sm text-gray-500">No views yet.</p> : (
              <ul className="space-y-3">
                {viewers.map(({ viewer, viewedAt }) => (
                  <li key={viewer.id} className="flex items-center gap-3">
                    <img src={viewer.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewer.userName || "User")}`} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{viewer.userName}</span>
                    <span className="text-xs text-gray-500">{new Date(viewedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default StoryViewer;