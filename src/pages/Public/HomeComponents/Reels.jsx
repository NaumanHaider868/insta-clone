import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { FaHeart, FaComment, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import {
  addReelComment,
  fetchReelComments,
  fetchReelsFeed,
  toggleLikeReel,
  getStoredSession,
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

  useEffect(() => {
    const loadReels = async () => {
      try {
        setLoading(true);
        const response = await fetchReelsFeed();
        setReels(response?.items || []);
        setError("");
      } catch (feedError) {
        setError(feedError.message || "Unable to load reels.");
      } finally {
        setLoading(false);
      }
    };

    loadReels();
  }, []);

  const nextReel = (direction) => {
    if (reels.length === 0) return;
    setCurrentReelIndex((prevIndex) => {
      if (direction === "up") {
        return prevIndex === 0 ? reels.length - 1 : prevIndex - 1;
      }
      return prevIndex === reels.length - 1 ? 0 : prevIndex + 1;
    });
  };

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
  }, [reels.length]);

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
      <Reel reel={reels[currentReelIndex]} onNext={nextReel} />
    </div>
  );
};

const Reel = ({ reel, onNext }) => {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [liked, setLiked] = useState(Boolean(reel.isLiked));
  const [likesCount, setLikesCount] = useState(reel.likesCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const { user } = getStoredSession();

  const loadComments = async () => {
    try {
      const response = await fetchReelComments(reel.id);
      setComments(response?.items || []);
    } catch {
      setComments([]);
    }
  };

  useEffect(() => {
    if (commentOpen) loadComments();
  }, [commentOpen, reel.id]);

  const handleLikeToggle = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const response = await toggleLikeReel(reel.id, liked);
      const nextLiked = Boolean(response?.liked ?? !liked);
      setLiked(nextLiked);
      setLikesCount((current) => Math.max(0, current + (nextLiked ? 1 : -1) - (liked ? 1 : 0)));
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
      setCommentInput("");
    } catch {
      return;
    } finally {
      setCommentLoading(false);
    }
  };

  const handleVideoClick = () => setPlaying((prev) => !prev);
  const toggleMute = () => setMuted((prev) => !prev);

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
            commentsCount={reel.commentsCount || comments.length}
            onLikeToggle={handleLikeToggle}
            onCommentToggle={() => setCommentOpen((prev) => !prev)}
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

const VideoActions = ({ liked, likesCount, commentsCount, onLikeToggle, onCommentToggle, isLoading }) => {
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
    </div>
  );
};

export default ReelsPage;
