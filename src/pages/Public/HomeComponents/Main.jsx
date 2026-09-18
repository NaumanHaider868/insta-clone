import React, { useEffect, useMemo, useState } from "react";
import StoryRow from "./Story";
import Suggestions from "./Suggestions";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Pagination, Navigation } from "swiper/modules";
import {
  addPostComment,
  fetchHomeFeed,
  fetchPostComments,
  toggleLikePost,
  clearSession,
  getStoredSession,
} from "../../../services/api";

const formatDate = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
};

const PostCard = ({ post, currentUserId, onDeletePost }) => {
  const [liked, setLiked] = useState(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [comments, setComments] = useState([]);
  const [commentOpen, setCommentOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const media = useMemo(() => post.media || [], [post.media]);
  const isOwnPost = post.user?.id === currentUserId;

  const loadComments = async () => {
    try {
      const response = await fetchPostComments(post.id);
      setComments(response?.items || []);
    } catch {
      setComments([]);
    }
  };

  useEffect(() => {
    if (commentOpen) {
      loadComments();
    }
  }, [commentOpen, post.id]);

  const handleLikeToggle = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const response = await toggleLikePost(post.id, liked);
      const nextLiked = Boolean(response?.liked ?? !liked);
      setLiked(nextLiked);
      setLikesCount((current) => Math.max(0, current + (nextLiked ? 1 : -1) - (liked ? 1 : 0)));
    } catch {
      return;
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    const content = newComment.trim();
    if (!content || commentLoading) return;

    setCommentLoading(true);
    try {
      const response = await addPostComment(post.id, content);
      setComments((current) => [response, ...current]);
      setNewComment("");
    } catch {
      return;
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div key={post.id} className="posts mb-4">
      <div className="bg-[#EFEFEF] rounded-[25px] dark:bg-[#ffffff1c] post">
        <div className="rounded-3xl flex overflow-hidden max-w-[57rem] p-[14px] dark:text-white">
          <div className="w-[56%] relative post-content">
            {media.length > 1 ? (
              <Swiper
                modules={[Keyboard, Pagination, Navigation]}
                navigation
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
                className="w-full h-full"
              >
                {media.map((image, index) => (
                  <SwiperSlide key={image.id || index}>
                    <img
                      src={image.url}
                      alt={`Post Slide ${index + 1}`}
                      className="object-contain w-full h-full rounded-[30px]"
                    />
                    <div className="post-more">
                      <i className="post-more-icon"></i>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : media.length === 1 ? (
              <img
                src={media[0].url}
                alt="Post"
                className="object-contain w-full h-full rounded-[30px]"
              />
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center rounded-[30px] bg-neutral-200 text-sm text-neutral-500">
                No media available
              </div>
            )}
          </div>

          <div className="w-[44%] p-5 pr-0 post-detail">
            <div className="flex items-center mb-4">
              <div className="avatar-post-div w-10 h-10 rounded-full mr-3">
                <img
                  src={post.user?.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(post.user?.userName || "User")}
                  alt="Avatar"
                  className="p-[2px] rounded-full cursor-pointer h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-sm cursor-pointer">{post.user?.userName || "Unknown user"}</p>
                <p className="text-xs text-gray-500 dark:text-white">{formatDate(post.createdAt)}</p>
              </div>
              {isOwnPost && (
                <div className="relative ml-auto">
                  <button
                    type="button"
                    className="text-gray-500 dark:text-white font-bold text-[22px]"
                    onClick={() => setActionMenuOpen((open) => !open)}
                  >
                    &#8942;
                  </button>
                  {actionMenuOpen && (
                    <div className="absolute right-0 top-10 z-20 rounded-lg border border-gray-200 bg-white p-2 text-sm shadow-lg dark:border-gray-700 dark:bg-[#1f1f1f]">
                      <button type="button" className="whitespace-nowrap text-red-500" onClick={() => onDeletePost(post.id)}>
                        Delete post
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {post.caption && (
              <p className="text-sm mb-4">
                {post.caption}
              </p>
            )}

            <div className="flex mb-4 flex-col">
              <div className="action-div w-[188px] h-[46px] bg-[#F8F8F8] rounded-full flex items-center justify-center">
                <button type="button" className="mr-3 w-[20px] h-[20px]" onClick={handleLikeToggle} disabled={likeLoading}>
                  <i className={`post-like ${liked ? "text-red-500" : "text-gray-500"}`} aria-label="Like post"></i>
                </button>
                <button type="button" className="mr-3 w-[20px] h-[20px]" onClick={() => setCommentOpen((open) => !open)}>
                  <i className="post-commant" aria-label="Comments"></i>
                </button>
              </div>
              <p className="text-[#000000] text-base ml-3 mt-2 dark:text-white">
                {likesCount.toLocaleString()} likes
              </p>
            </div>

            <div className="text-sm">
              {comments.length > 0 ? (
                <div className="mb-3 space-y-3">
                  {comments.slice(0, 2).map((comment) => (
                    <div key={comment.id} className="flex items-start">
                      <img
                        src={comment.user?.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(comment.user?.userName || "User")}
                        alt={comment.user?.userName || "User"}
                        className="w-8 h-8 rounded-full mr-3 cursor-pointer"
                      />
                      <div>
                        <p>
                          <span className="font-bold cursor-pointer">{comment.user?.userName || "User"}</span>{" "}
                          {comment.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 dark:text-white">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-3 text-xs text-gray-500">No comments yet.</p>
              )}

              <button type="button" className="text-xs text-gray-500 mb-4 cursor-pointer dark:text-white" onClick={() => setCommentOpen((open) => !open)}>
                {commentOpen ? "Hide comments" : `View all ${post.commentsCount || comments.length} comments`}
              </button>

              {commentOpen && (
                <div className="space-y-3">
                  <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-[#0f0f0f]">
                    {comments.length === 0 ? (
                      <p className="text-xs text-gray-500">No comments available.</p>
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
                  <div className="flex gap-2">
                    <input
                      value={newComment}
                      onChange={(event) => setNewComment(event.target.value)}
                      placeholder="Add a comment..."
                      className="h-9 flex-1 rounded-full border border-[#ddd] bg-white px-3 text-xs text-black outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddComment}
                      disabled={commentLoading || !newComment.trim()}
                      className="rounded-full bg-[#4c77e2] px-3 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {commentLoading ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = getStoredSession();

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetchHomeFeed();
      setPosts(response?.items || []);
      setError("");
    } catch (feedError) {
      setError(feedError.message || "Unable to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
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
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete post.");
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
                {!loading && !error && posts.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-[#111111] dark:text-gray-300">
                    No posts yet. Follow people to see their posts here.
                  </div>
                )}
                {!loading && posts.map((post) => (
                  <PostCard key={post.id} post={post} currentUserId={user?.id} onDeletePost={handleDeletePost} />
                ))}
              </div>
              <div className="content-suggestion w-[25%]">
                <Suggestions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
