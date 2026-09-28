import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaHeart,
  FaPlane,
  FaPlaneDeparture,
  FaRegComment,
  FaRegHeart,
  FaEllipsisV,
  FaEdit,
  FaTrashAlt,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import StoryRow from "./Story";
import Suggestions from "./Suggestions";
import UploadModal from "./UploadModal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Pagination, Navigation } from "swiper/modules";

import {
  addPostComment,
  addReelComment,
  fetchHomeFeed,
  fetchPostComments,
  fetchReelComments,
  deleteReel,
  toggleLikeReel,
  toggleLikePost,
  getStoredSession,
} from "../../../services/api";

// Tune this to whatever height fits your layout — every card, post or reel,
// will now be exactly this tall regardless of media aspect ratio.
const FEED_CARD_HEIGHT = "h-[500px]";

const formatDate = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
};

const splitCaption = (caption, chunkSize = 480) => {
  const chunks = [];
  let start = 0;

  while (start < caption.length) {
    while (caption[start] === " ") start += 1;
    let end = Math.min(start + chunkSize, caption.length);
    if (end < caption.length) {
      const wordBoundary = caption.lastIndexOf(" ", end);
      if (wordBoundary > start) end = wordBoundary;
    }
    chunks.push(caption.slice(start, end).trimEnd());
    start = end;
  }

  return chunks;
};

const shareContent = async ({ type, id, caption }) => {
  const url = `${window.location.origin}/${type}/${id}`;
  const shareData = {
    title: type === "post" ? "Instagram post" : "Instagram reel",
    text: caption || "Check this out on Instagram",
    url,
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  await navigator.clipboard.writeText(url);
};

// Config that captures the ONLY real differences between a post and a reel.
const CONTENT_CONFIG = {
  post: {
    fetchComments: fetchPostComments,
    addComment: addPostComment,
    toggleLike: toggleLikePost,
  },
  reel: {
    fetchComments: fetchReelComments,
    addComment: addReelComment,
    toggleLike: toggleLikeReel,
  },
};

const CommentText = ({ content }) => {
  const [expanded, setExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement || expanded) return;

    const measureOverflow = () => {
      setNeedsExpansion(textElement.scrollHeight > textElement.clientHeight + 1);
    };
    measureOverflow();

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(textElement);
    return () => observer.disconnect();
  }, [content, expanded]);

  return (
    <div className="min-w-0 flex-1">
      <p ref={textRef} className={`whitespace-pre-wrap break-all ${!expanded ? "line-clamp-3" : ""}`}>
        {content}
      </p>
      {needsExpansion && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-300"
        >
          {expanded ? "Hide" : "more"}
        </button>
      )}
    </div>
  );
};

/**
 * Renders either a post or a reel. `type` is "post" | "reel".
 * Everything except media rendering and which API calls to hit is shared.
 */
const FeedCard = ({ type, item, currentUserId, onDelete, onEdit }) => {
  const config = CONTENT_CONFIG[type];

  const [liked, setLiked] = useState(Boolean(item.isLiked));
  const [likesCount, setLikesCount] = useState(item.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(item.commentsCount || 0);
  const [comments, setComments] = useState(item.comments || []);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState((item.commentsCount || 0) > (item.comments || []).length);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [muted, setMuted] = useState(true);
  const [visibleCaptionChunks, setVisibleCaptionChunks] = useState(1);

  const menuRef = useRef(null);

  const media = useMemo(() => {
    if (item.media?.length) return item.media;
    // reels from the API may only expose a single videoUrl instead of a media array
    if (type === "reel" && item.videoUrl) return [{ url: item.videoUrl }];
    return [];
  }, [item.media, item.videoUrl, type]);

  const isOwnItem = item.user?.id === currentUserId;

  // Close the action menu on outside click.
  useEffect(() => {
    if (!actionMenuOpen) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActionMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionMenuOpen]);

  const captionChunks = useMemo(() => splitCaption(item.caption || ""), [item.caption]);
  const totalComments = Math.max(commentsCount, comments.length);

  const handleLikeToggle = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const response = await config.toggleLike(item.id, liked);
      const nextLiked = Boolean(response?.liked ?? !liked);
      setLiked(nextLiked);
      setLikesCount((current) => Math.max(0, current + (nextLiked ? 1 : -1)));
    } catch {
      // keep previous state on failure
    } finally {
      setLikeLoading(false);
    }
  };

  const handleLoadMoreComments = async () => {
    if (loadingMoreComments || !hasMoreComments) return;
    setLoadingMoreComments(true);
    try {
      const response = await config.fetchComments(item.id, commentsPage + 1, 3);
      const nextComments = response?.items || [];
      setComments((current) => [
        ...current,
        ...nextComments.filter((comment) => !current.some((existing) => existing.id === comment.id)),
      ]);
      setCommentsPage(response?.pagination?.page || commentsPage + 1);
      setHasMoreComments(Boolean(response?.pagination?.hasNextPage));
      setCommentsError("");
    } catch (loadError) {
      setCommentsError(loadError.message || "Unable to load more comments.");
    } finally {
      setLoadingMoreComments(false);
    }
  };

  const handleAddComment = async () => {
    const content = newComment.trim();
    if (!content || commentLoading) return;

    setCommentLoading(true);
    try {
      const response = await config.addComment(item.id, content);
      setComments((current) => [response, ...current]);
      setCommentsCount((current) => current + 1);
      setNewComment("");
    } catch {
      // keep the typed comment on failure so the user can retry
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await shareContent({ type, id: item.id, caption: item.caption });
      setShareMessage("Link copied");
      window.setTimeout(() => setShareMessage(""), 1800);
    } catch {
      setShareMessage("");
    }
  };

  const mediaClass = "h-full w-full rounded-[30px] object-cover";

  const renderMediaItem = (mediaItem) =>
    type === "reel" ? (
      <video
        src={mediaItem.url}
        poster={item.thumbnailUrl || undefined}
        autoPlay
        loop
        muted={muted}
        playsInline
        className={mediaClass}
      />
    ) : (
      <img src={mediaItem.url} alt="Post" className={mediaClass} />
    );

  return (
    <div className="posts mb-4">
      <div className="bg-[#EFEFEF] rounded-[25px] dark:bg-[#ffffff1c] post">
        <div
          className={`rounded-3xl flex ${FEED_CARD_HEIGHT} overflow-hidden max-w-[57rem] p-[14px] dark:text-white`}
        >
          {/* MEDIA */}
          <div className="w-[56%] h-full relative post-content">
            {media.length > 1 ? (
              <Swiper
                modules={[Keyboard, Pagination, Navigation]}
                navigation
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
                className="h-full w-full"
              >
                {media.map((mediaItem, index) => (
                  <SwiperSlide key={mediaItem.id || index} className="h-full">
                    {renderMediaItem(mediaItem)}
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : media.length === 1 ? (
              renderMediaItem(media[0])
            ) : (
              <div className="flex h-full items-center justify-center rounded-[30px] bg-neutral-200 text-sm text-neutral-500">
                No media available
              </div>
            )}
            {type === "reel" && (
              <button
                type="button"
                onClick={() => setMuted((currentMuted) => !currentMuted)}
                aria-label={muted ? "Unmute reel" : "Mute reel"}
                className="absolute right-5 top-5 z-20 text-2xl text-white"
              >
                {muted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            )}
          </div>

          {/* DETAILS */}
          <div className="w-[44%] h-full flex flex-col p-5 pr-0 post-detail">
            <div className="flex items-center mb-4 shrink-0">
              <div className="avatar-post-div w-10 h-10 rounded-full mr-3">
                <img
                  src={
                    item.user?.profileImage ||
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(item.user?.userName || "User")
                  }
                  alt="Avatar"
                  className="p-[2px] rounded-full cursor-pointer h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-sm cursor-pointer">
                  {item.user?.userName || "Unknown user"}
                </p>
                <p className="text-xs text-gray-500 dark:text-white">{formatDate(item.createdAt)}</p>
              </div>

              {isOwnItem && (
                <div className="relative ml-auto" ref={menuRef}>
                  <button
                    type="button"
                    aria-label={`${type} options`}
                    onClick={() => setActionMenuOpen((open) => !open)}
                    className={`grid h-8 w-8 place-items-center rounded-full text-gray-500 transition hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10 ${actionMenuOpen ? "bg-black/5 dark:bg-white/10" : ""
                      }`}
                  >
                    <FaEllipsisV size={14} />
                  </button>

                  <div
                    className={`absolute right-0 top-10 z-20 min-w-[170px] origin-top-right rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg ring-1 ring-black/5 transition duration-150 dark:border-gray-800 dark:bg-[#1f1f1f] ${actionMenuOpen
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-95 opacity-0"
                      }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActionMenuOpen(false);
                        onEdit(item, type);
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <FaEdit size={13} />
                      Edit {type}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActionMenuOpen(false);
                        onDelete(item.id);
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <FaTrashAlt size={13} />
                      Delete {type}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {item.caption && (
              <div className={`mb-4 shrink-0 ${captionChunks.length > 1 ? "flex h-32 flex-col" : ""}`}>
                <div className={`space-y-2 text-sm ${captionChunks.length > 1 ? "min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" : ""}`}>
                  {captionChunks.slice(0, visibleCaptionChunks).map((chunk, index) => (
                    <p key={index} className={visibleCaptionChunks === 1 && captionChunks.length > 1 ? "line-clamp-2" : "whitespace-pre-wrap"}>
                      {chunk}
                    </p>
                  ))}
                </div>
                <div className="mt-1 flex shrink-0 gap-3">
                  {visibleCaptionChunks < captionChunks.length && (
                  <button
                    type="button"
                    onClick={() => setVisibleCaptionChunks((visible) => visible + 1)}
                    className="text-xs font-semibold text-gray-500 dark:text-gray-300"
                  >
                    {visibleCaptionChunks === 1 ? "more" : "Show more"}
                  </button>
                  )}
                  {visibleCaptionChunks > 1 && (
                    <button
                      type="button"
                      onClick={() => setVisibleCaptionChunks(1)}
                      className="text-xs font-semibold text-gray-500 dark:text-gray-300"
                    >
                      Hide
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex mb-4 flex-col shrink-0">
              <div className="flex w-fit items-center gap-4 bg-transparent">
                <button
                  type="button"
                  aria-label={`Like ${type}`}
                  className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm transition hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={handleLikeToggle}
                  disabled={likeLoading}
                >
                  {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
                  <span>{likesCount.toLocaleString()}</span>
                </button>
                <button
                  type="button"
                  aria-label={`${type} comments`}
                  className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm text-gray-500 transition hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10"
                >
                  <FaRegComment />
                  <span>{totalComments.toLocaleString()}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Share ${type}`}
                  title={`Share ${type}`}
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm text-gray-500 transition hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10"
                >
                  <FiShare2 />
                  {shareMessage && <span className="text-xs">{shareMessage}</span>}
                </button>
              </div>
            </div>

            {/* Scrollable comments — this is what keeps the card height fixed
                even when there are lots of comments */}
            <div className="min-h-[112px] min-w-0 flex-1 overflow-y-auto pr-2 text-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start">
                      <img
                        src={
                          comment.user?.profileImage ||
                          "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(comment.user?.userName || "User")
                        }
                        alt={comment.user?.userName || "User"}
                        className="w-8 h-8 rounded-full mr-3 cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <p>
                          <span className="font-bold cursor-pointer">
                            {comment.user?.userName || "User"}
                          </span>{" "}
                        </p>
                        <CommentText content={comment.content} />
                        <p className="text-xs text-gray-500 mt-1 dark:text-white">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No comments yet.</p>
              )}
              {commentsError && <p className="mt-3 text-xs text-red-500">{commentsError}</p>}
              {hasMoreComments && (
                <button
                  type="button"
                  onClick={handleLoadMoreComments}
                  disabled={loadingMoreComments}
                  className="mt-3 text-xs font-semibold text-blue-600 disabled:opacity-60"
                >
                  {loadingMoreComments ? "Loading..." : "Load more comments"}
                </button>
              )}
            </div>

            <div className="flex h-10 mt-3 shrink-0">
              <input
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                placeholder="Add a comment..."
                className="min-w-0 flex-1 rounded-l-[10px] border border-[#ddd] bg-white px-3 text-xs text-black outline-none"
              />
              <button
                type="button"
                onClick={handleAddComment}
                disabled={commentLoading || !newComment.trim()}
                aria-label={commentLoading ? "Posting comment" : "Post comment"}
                className="comment-submit-button cursor-pointer rounded-r-[10px] px-3 text-xs font-semibold text-white disabled:opacity-60"
              >
                {commentLoading ? (
                  <FaPlaneDeparture className="plane-departure-animation" />
                ) : (
                  <FaPlane />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Post = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const { user } = getStoredSession();

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetchHomeFeed();
      setFeedItems(response?.items || []);
      setError("");
    } catch (feedError) {
      setError(feedError.message || "Unable to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();

    const handleContentCreated = () => loadPosts();
    window.addEventListener("instagram:content-created", handleContentCreated);
    return () => window.removeEventListener("instagram:content-created", handleContentCreated);
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8000/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("insta_token") || ""}`,
        },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Failed to delete post");
      setFeedItems((currentItems) => currentItems.filter((item) => item.id !== postId));
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete post.");
    }
  };

  const handleDeleteReel = async (reelId) => {
    try {
      await deleteReel(reelId);
      setFeedItems((currentItems) => currentItems.filter((item) => item.id !== reelId));
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete reel.");
    }
  };

  return (
    <div className="content w-full h-full pt-5">
      <div className="flex">
        <div className="1 w-full h-full flex main-content">
          <div className="w-full main-content-w">
            <div className="story-content pb-5 w-[75%]">
              <StoryRow />
            </div>
            <div className="flex main-home">
              <div className="pt-4 content w-[75%] h-full">
                {loading && <div className="mb-5 text-sm text-gray-500">Loading feed...</div>}
                {!loading && error && <div className="mb-5 text-sm text-red-500">{error}</div>}
                {!loading && !error && feedItems.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-[#111111] dark:text-gray-300">
                    No posts yet. Follow people to see their posts here.
                  </div>
                )}
                {!loading &&
                  feedItems.map((item) => (
                    <FeedCard
                      key={`${item.contentType}-${item.id}`}
                      type={item.contentType === "reel" ? "reel" : "post"}
                      item={item}
                      currentUserId={user?.id}
                      onDelete={item.contentType === "reel" ? handleDeleteReel : handleDeletePost}
                      onEdit={(editItem, type) => setEditingItem({ ...editItem, contentType: type })}
                    />
                  ))}
              </div>
              <div className="content-suggestion w-[25%]">
                <Suggestions />
              </div>
            </div>
          </div>
        </div>
      </div>
      {editingItem && <UploadModal editItem={editingItem} onClose={() => setEditingItem(null)} />}
    </div>
  );
};

export default Post;