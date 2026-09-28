import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { FaHeart, FaComment, FaPlane, FaPlaneDeparture, FaTimes, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import {
  addReelComment,
  fetchReelComments,
  fetchReelsFeed,
  toggleLikeReel,
} from "../../../services/api";

const formatDate = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
};

const ReelsPage = () => {
  const [reels, setReels] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);
  const loadingMoreRef = useRef(false);
  const loadMoreReels = useCallback(async () => {
    if (!hasNextPage || loadingMoreRef.current) return false;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const response = await fetchReelsFeed(pageRef.current + 1);
      const nextReels = response?.items || [];
      setReels((currentReels) => [...currentReels, ...nextReels]);
      pageRef.current = response?.pagination?.page || pageRef.current + 1;
      setHasNextPage(Boolean(response?.pagination?.hasNextPage));
      return nextReels.length > 0;
    } catch {
      return false;
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [hasNextPage]);

  useEffect(() => {
    const loadReels = async () => {
      try {
        setLoading(true);
        const response = await fetchReelsFeed();
        setReels(response?.items || []);
        pageRef.current = response?.pagination?.page || 1;
        setHasNextPage(Boolean(response?.pagination?.hasNextPage));
        setError("");
      } catch (feedError) {
        setError(feedError.message || "Unable to load reels.");
      } finally {
        setLoading(false);
      }
    };

    loadReels();
  }, []);

  const nextReel = useCallback(async (direction) => {
    if (reels.length === 0) return;

    if (direction === "up") {
      setCurrentReelIndex((index) => Math.max(0, index - 1));
      return;
    }

    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex((index) => index + 1);
      return;
    }

    if (hasNextPage) {
      const nextIndex = reels.length;
      if (await loadMoreReels()) setCurrentReelIndex(nextIndex);
      return;
    }

  }, [currentReelIndex, hasNextPage, loadMoreReels, reels.length]);

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      nextReel(e.deltaY < 0 ? "up" : "down");
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        nextReel("up");
      } else if (e.key === "ArrowDown") {
        nextReel("down");
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextReel]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-sm text-gray-500">Loading reels...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-sm text-red-500">{error}</div>;
  }

  if (reels.length === 0) {
    return <div className="flex h-screen items-center justify-center text-sm text-gray-500">No reels yet.</div>;
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center scrollbar-hidden">
      <Reel key={reels[currentReelIndex].id} reel={reels[currentReelIndex]} />
      {loadingMore && <span className="sr-only">Loading more reels...</span>}
    </div>
  );
};

const Reel = ({ reel }) => {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [liked, setLiked] = useState(Boolean(reel.isLiked));
  const [likesCount, setLikesCount] = useState(reel.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(reel.commentsCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const loadComments = useCallback(async () => {
    try {
      const response = await fetchReelComments(reel.id);
      setComments(response?.items || []);
    } catch {
      setComments([]);
    }
  }, [reel.id]);

  useEffect(() => {
    if (commentOpen) loadComments();
  }, [commentOpen, loadComments]);

  useEffect(() => {
    if (!commentOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setCommentOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [commentOpen]);

  const handleLikeToggle = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const response = await toggleLikeReel(reel.id, liked);
      const nextLiked = Boolean(response?.liked ?? !liked);
      setLiked(nextLiked);
      setLikesCount((current) => Math.max(0, current + (nextLiked ? 1 : -1)));
    } catch {
      return;
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    const content = commentInput.trim();
    if (!content || commentLoading) return;
    setCommentLoading(true);
    setCommentsError("");
    try {
      const response = await addReelComment(reel.id, content);
      setComments((current) => [response, ...current]);
      setCommentsCount((current) => current + 1);
      setCommentInput("");
    } catch (error) {
      setCommentsError(error.message || "Unable to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleVideoClick = () => setPlaying((prev) => !prev);
  const toggleMute = () => setMuted((prev) => !prev);

  const handleShare = async () => {
    const url = `${window.location.origin}/reels`;
    const shareData = {
      title: "Instagram reel",
      text: reel.caption || `Check out @${reel.user?.userName || "User"}'s reel`,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage("Shared");
      } else {
        await copyShareUrl(url);
        setShareMessage("Link copied");
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      try {
        await copyShareUrl(url);
        setShareMessage("Link copied");
      } catch {
        setShareMessage("Unable to share");
      }
    }
    window.setTimeout(() => setShareMessage(""), 1800);
  };

  return (
    <div className="relative h-screen flex pt-[10px] pb-[10px] reels-sec">
      <ReactPlayer
        url={reel.videoUrl}
        playing={playing}
        loop
        muted={muted}
        width="350px"
        height="100%"
        playsinline
        onClick={handleVideoClick}
        style={{ pointerEvents: "auto", zIndex: 1 }}
      />

      <button onClick={toggleMute} className="absolute right-5 top-5 z-20 text-white text-2xl">
        {muted ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>
      <div className="flex items-end justify-between w-[350px] absolute bottom-0 px-[18px] pb-[20px]">
        <div className="text-white z-10 max-w-[220px]">
          <UserDetails
            username={reel.user?.userName || "User"}
            description={reel.caption || ""}
            profilePic={reel.user?.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(reel.user?.userName || "User")}
            createdAt={reel.createdAt}
          />
        </div>

        <div className="text-white flex flex-col items-center space-y-6">
          <VideoActions
            liked={liked}
            likesCount={likesCount}
            commentsCount={commentsCount || comments.length}
            onLikeToggle={handleLikeToggle}
            onCommentToggle={() => setCommentOpen((prev) => !prev)}
            onShare={handleShare}
            shareMessage={shareMessage}
            isLoading={likeLoading}
          />
        </div>
      </div>

      {commentOpen && (
        <div className="absolute bottom-24 left-1/2 z-30 flex max-h-[55vh] w-[min(360px,calc(100vw-32px))] -translate-x-1/2 flex-col rounded-xl border border-gray-200 bg-white p-4 text-gray-900 shadow-xl dark:border-gray-700 dark:bg-[#1d1d1d] dark:text-white">
          <div className="mb-3 flex shrink-0 items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
            <h2 className="text-sm font-semibold">Comments</h2>
            <button type="button" onClick={() => setCommentOpen(false)} aria-label="Close comments" title="Close comments" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10">
              <FaTimes />
            </button>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto text-sm">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-500">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start">
                  <img src={comment.user?.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(comment.user?.userName || "User")} alt={comment.user?.userName || "User"} className="mr-3 h-8 w-8 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{comment.user?.userName || "User"}</p>
                    <ReelCommentText content={comment.content} />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {commentsError && <p className="mt-2 text-xs text-red-500">{commentsError}</p>}
          <form onSubmit={(event) => { event.preventDefault(); handleCommentSubmit(); }} className="mt-3 flex h-10 shrink-0">
            <input
              value={commentInput}
              onChange={(event) => setCommentInput(event.target.value)}
              maxLength={1000}
              aria-label="Add a comment"
              className="min-w-0 flex-1 rounded-l-[10px] border border-gray-300 bg-white px-3 text-xs text-black outline-none dark:border-gray-600 dark:bg-transparent dark:text-white"
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              disabled={commentLoading || !commentInput.trim()}
              aria-label={commentLoading ? "Posting comment" : "Post comment"}
              className="comment-submit-button cursor-pointer rounded-r-[10px] px-3 text-xs font-semibold text-white disabled:opacity-60"
            >
              {commentLoading ? <FaPlaneDeparture className="plane-departure-animation" /> : <FaPlane />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const ReelCommentText = ({ content }) => {
  const [expanded, setExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element || expanded) return undefined;

    const measureOverflow = () => {
      setNeedsExpansion(element.scrollHeight > element.clientHeight + 1);
    };
    measureOverflow();
    const observer = new ResizeObserver(measureOverflow);
    observer.observe(element);
    return () => observer.disconnect();
  }, [content, expanded]);

  return (
    <div>
      <p ref={textRef} className={`whitespace-pre-wrap break-words ${expanded ? "" : "line-clamp-3"}`}>
        {content}
      </p>
      {needsExpansion && (
        <button type="button" onClick={() => setExpanded((current) => !current)} className="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
          {expanded ? "less" : "more"}
        </button>
      )}
    </div>
  );
};

const copyShareUrl = async (url) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return;
    } catch {
      // Use the legacy copy command when clipboard permissions are unavailable.
    }
  }

  const input = document.createElement("textarea");
  input.value = url;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("Clipboard access is unavailable");
};

const UserDetails = ({ username, description, profilePic, createdAt }) => {
  const [expanded, setExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element || expanded) return undefined;

    const measureOverflow = () => {
      setNeedsExpansion(element.scrollHeight > element.clientHeight + 1);
    };
    measureOverflow();

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(element);
    return () => observer.disconnect();
  }, [description, expanded]);

  return (
    <div className="flex items-start space-x-3">
      <img src={profilePic} alt={username} className="h-10 w-10 shrink-0 rounded-full border-2 border-white" />
      <div className="min-w-0">
        <p className="font-bold">{username}</p>
        {description && (
          <>
            <p ref={descriptionRef} className={`mt-1 whitespace-pre-wrap break-words text-sm text-gray-200 ${expanded ? "" : "line-clamp-2"}`}>
              {description}
            </p>
            {needsExpansion && (
              <button type="button" onClick={() => setExpanded((current) => !current)} className="mt-1 text-xs font-semibold text-gray-300">
                {expanded ? "less" : "more"}
              </button>
            )}
          </>
        )}
        <p className="text-[10px] text-gray-300">{formatDate(createdAt)}</p>
      </div>
    </div>
  );
};

const VideoActions = ({ liked, likesCount, commentsCount, onLikeToggle, onCommentToggle, onShare, shareMessage, isLoading }) => {
  return (
    <div className="space-y-6 z-10">
      <div className="flex flex-col items-center">
        <button onClick={onLikeToggle} className="focus:outline-none disabled:opacity-60" disabled={isLoading}>
          <FaHeart className={`w-8 h-8 ${liked ? "text-red-500" : "text-white"}`} />
        </button>
        <p>{likesCount}</p>
      </div>

      <div className="flex flex-col items-center">
        <button onClick={onCommentToggle} className="focus:outline-none">
          <FaComment className="w-8 h-8 text-white" />
        </button>
        <p>{commentsCount}</p>
      </div>

      <div className="flex flex-col items-center">
        <button onClick={onShare} aria-label="Share reel" title="Share reel" className="focus:outline-none">
          <FiShare2 className="h-7 w-7 text-white" />
        </button>
        {shareMessage && <p className="text-[10px]">{shareMessage}</p>}
      </div>
    </div>
  );
};

export default ReelsPage;
