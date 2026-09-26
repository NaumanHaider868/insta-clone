import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { FaHeart, FaComment, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
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
      setCurrentReelIndex((index) => (index === 0 ? reels.length - 1 : index - 1));
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

    setCurrentReelIndex(0);
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
    try {
      const response = await addReelComment(reel.id, content);
      setComments((current) => [response, ...current]);
      setCommentsCount((current) => current + 1);
      setCommentInput("");
    } catch {
      return;
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
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied");
        window.setTimeout(() => setShareMessage(""), 1800);
      }
    } catch {
      setShareMessage("");
    }
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
        <div className="absolute bottom-24 left-1/2 z-30 w-[330px] -translate-x-1/2 rounded-xl border border-gray-700 bg-black/80 p-3 text-white backdrop-blur-sm">
          <div className="max-h-40 space-y-2 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-300">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2 text-xs">
                  <img src={comment.user?.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(comment.user?.userName || "User")} alt={comment.user?.userName || "User"} className="h-6 w-6 rounded-full" />
                  <div>
                    <span className="font-bold">{comment.user?.userName || "User"}</span>
                    <span className="ml-2">{comment.content}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={commentInput}
              onChange={(event) => setCommentInput(event.target.value)}
              className="h-9 flex-1 rounded-full border border-gray-600 bg-[#1a1a1a] px-3 text-xs text-white outline-none"
              placeholder="Add a comment"
            />
            <button
              type="button"
              onClick={handleCommentSubmit}
              disabled={commentLoading || !commentInput.trim()}
              className="rounded-full bg-[#4c77e2] px-3 text-xs font-semibold text-white disabled:opacity-60"
            >
              {commentLoading ? "..." : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const UserDetails = ({ username, description, profilePic, createdAt }) => {
  return (
    <div className="flex items-center space-x-3">
      <img src={profilePic} alt={username} className="w-10 h-10 rounded-full border-2 border-white" />
      <div>
        <p className="font-bold">{username}</p>
        {description && <p className="text-sm text-gray-200">{description}</p>}
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
