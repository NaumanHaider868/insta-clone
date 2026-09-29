import { useEffect, useRef, useState } from 'react';
import { FaCamera, FaChevronLeft, FaChevronRight, FaComment, FaEdit, FaHeart, FaPlane, FaPlaneDeparture, FaPlay, FaRegHeart, FaTimes, FaTrash } from 'react-icons/fa';
import UploadModal from './UploadModal';
import {
    addPostComment,
    addReelComment,
    fetchPostComments,
    fetchReelComments,
    fetchFollowers,
    fetchFollowing,
    fetchUserPosts,
    fetchUserProfile,
    fetchUserReels,
    getStoredSession,
    deletePost,
    deleteReel,
    toggleLikePost,
    toggleLikeReel,
    updateUserProfile,
} from '../../../services/api';

const formatDate = (value) => {
    if (!value) return 'Just now';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Just now';
    return new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
};

const ProfileEditor = ({ profile, onClose, onSave }) => {
    const [bio, setBio] = useState(profile.profile || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        try {
            await onSave({ profile: bio });
        } catch (saveError) {
            setError(saveError.message || 'Unable to update profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4" onMouseDown={onClose}>
            <form onSubmit={submit} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-2xl dark:bg-[#1d1d1d] dark:text-white">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Edit profile</h2>
                    <button type="button" aria-label="Close" onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"><FaTimes /></button>
                </div>
                <label className="block text-sm font-semibold" htmlFor="profile-bio">Bio</label>
                <textarea id="profile-bio" value={bio} onChange={(event) => setBio(event.target.value)} maxLength={500} rows={5} placeholder="Write a little about yourself" className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-transparent p-3 text-sm outline-none focus:border-gray-500 dark:border-gray-700" />
                <div className="mt-1 flex justify-end text-xs text-gray-500">{bio.length}/500</div>
                {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={saving} className="mt-5 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-black">{saving ? 'Saving...' : 'Save changes'}</button>
            </form>
        </div>
    );
};

const AvatarConfirmation = ({ action, profile, saving, onCancel, onConfirm }) => {
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (action?.type !== 'change' || !action.image) {
            setPreview('');
            return undefined;
        }
        const previewUrl = URL.createObjectURL(action.image);
        setPreview(previewUrl);
        return () => URL.revokeObjectURL(previewUrl);
    }, [action]);

    const isRemoving = action.type === 'remove';
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.userName || 'User')}`;
    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4" onMouseDown={onCancel}>
            <div onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 text-center text-gray-900 shadow-2xl dark:bg-[#1d1d1d] dark:text-white">
                <img src={isRemoving ? fallback : preview} alt="Profile photo preview" className="mx-auto mb-4 h-24 w-24 rounded-full object-cover" />
                <h2 className="text-lg font-semibold">{isRemoving ? 'Remove profile picture?' : 'Change profile picture?'}</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">{isRemoving ? 'Your profile will use the default image.' : 'Use this image as your profile picture?'}</p>
                <div className="mt-6 flex gap-3">
                    <button type="button" onClick={onCancel} disabled={saving} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold dark:border-gray-700">Cancel</button>
                    <button type="button" onClick={onConfirm} disabled={saving} className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-black">{saving ? 'Saving...' : isRemoving ? 'Remove' : 'Change photo'}</button>
                </div>
            </div>
        </div>
    );
};

const ProfileConnectionsModal = ({ userId, initialTab, onClose }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        setUsers([]);
        setPage(1);
        setHasNextPage(false);
        setLoading(true);
        setError('');
        const fetchConnections = activeTab === 'followers' ? fetchFollowers : fetchFollowing;
        fetchConnections(userId, 1, 20)
            .then((response) => {
                if (!active) return;
                setUsers(response?.items || []);
                setPage(response?.pagination?.page || 1);
                setHasNextPage(Boolean(response?.pagination?.hasNextPage));
            })
            .catch((loadError) => {
                if (active) setError(loadError.message || `Unable to load ${activeTab}.`);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, [activeTab, userId]);

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [onClose]);

    const loadMore = async () => {
        if (loadingMore || !hasNextPage) return;
        setLoadingMore(true);
        setError('');
        const fetchConnections = activeTab === 'followers' ? fetchFollowers : fetchFollowing;
        try {
            const response = await fetchConnections(userId, page + 1, 20);
            setUsers((current) => [...current, ...(response?.items || [])]);
            setPage(response?.pagination?.page || page + 1);
            setHasNextPage(Boolean(response?.pagination?.hasNextPage));
        } catch (loadError) {
            setError(loadError.message || `Unable to load more ${activeTab}.`);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4" onMouseDown={onClose}>
            <section role="dialog" aria-modal="true" aria-label="Profile connections" onMouseDown={(event) => event.stopPropagation()} className="flex max-h-[min(620px,85vh)] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white text-gray-900 shadow-2xl dark:bg-[#1d1d1d] dark:text-white">
                <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                    <h2 className="text-base font-semibold">{activeTab === 'followers' ? 'Followers' : 'Following'}</h2>
                    <button type="button" onClick={onClose} aria-label="Close connections" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"><FaTimes /></button>
                </header>
                <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-700">
                    {['followers', 'following'].map((tab) => (
                        <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize ${activeTab === tab ? 'border-blue-500 text-blue-600 dark:text-white' : 'border-transparent text-gray-500'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-5">
                    {error && <p role="alert" className="py-3 text-sm text-red-500">{error}</p>}
                    {loading ? (
                        <p className="py-8 text-center text-sm text-gray-500">Loading {activeTab}...</p>
                    ) : users.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-500">No {activeTab} yet.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <li key={user.id} className="flex items-center gap-3 py-3">
                                    <img src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName || 'User')}`} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">{user.userName}</p>
                                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">{`${user.firstName || ''} ${user.lastName || ''}`.trim()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {hasNextPage && !loading && (
                        <button type="button" onClick={loadMore} disabled={loadingMore} className="my-4 w-full rounded-md border border-gray-300 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:hover:bg-white/10">
                            {loadingMore ? 'Loading...' : 'Load more'}
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
};

const ProfileExpandableText = ({ content }) => {
    const [expanded, setExpanded] = useState(false);
    const [overflow, setOverflow] = useState(false);
    const textRef = useRef(null);

    useEffect(() => {
        const element = textRef.current;
        if (!element || expanded) return undefined;
        const measure = () => setOverflow(element.scrollHeight > element.clientHeight + 1);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [content, expanded]);

    return (
        <div className="min-w-0">
            <p ref={textRef} className={`whitespace-pre-wrap break-all text-sm ${expanded ? '' : 'line-clamp-3'}`}>{content}</p>
            {overflow && <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-300">{expanded ? 'Hide' : 'more'}</button>}
        </div>
    );
};

const ProfileContentModal = ({ item, type, onClose, onEdit, onDelete, canManage }) => {
    const media = type === 'reel'
        ? (item.media?.length ? item.media : [{ url: item.videoUrl }])
        : (item.media || []);
    const [activeMedia, setActiveMedia] = useState(0);
    const [comments, setComments] = useState([]);
    const [commentsPage, setCommentsPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsError, setCommentsError] = useState('');
    const [liked, setLiked] = useState(Boolean(item.isLiked));
    const [likesCount, setLikesCount] = useState(item.likesCount || 0);
    const [commentsCount, setCommentsCount] = useState(item.commentsCount || 0);
    const [likeLoading, setLikeLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const userName = item.user?.userName || 'User';
    const fetchComments = type === 'reel' ? fetchReelComments : fetchPostComments;
    const addComment = type === 'reel' ? addReelComment : addPostComment;
    const toggleLike = type === 'reel' ? toggleLikeReel : toggleLikePost;

    useEffect(() => {
        let active = true;
        setCommentsLoading(true);
        fetchComments(item.id, 1, 10)
            .then((response) => {
                if (!active) return;
                setComments(response?.items || []);
                setCommentsPage(response?.pagination?.page || 1);
                setHasMoreComments(Boolean(response?.pagination?.hasNextPage));
                setCommentsError('');
            })
            .catch((error) => {
                if (active) setCommentsError(error.message || 'Unable to load comments.');
            })
            .finally(() => {
                if (active) setCommentsLoading(false);
            });
        return () => { active = false; };
    }, [fetchComments, item.id]);

    useEffect(() => {
        const bodyOverflow = document.body.style.overflow;
        const documentOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = bodyOverflow;
            document.documentElement.style.overflow = documentOverflow;
        };
    }, []);

    const loadMoreComments = async () => {
        if (commentsLoading || !hasMoreComments) return;
        setCommentsLoading(true);
        try {
            const response = await fetchComments(item.id, commentsPage + 1, 10);
            setComments((current) => [...current, ...(response?.items || [])]);
            setCommentsPage(response?.pagination?.page || commentsPage + 1);
            setHasMoreComments(Boolean(response?.pagination?.hasNextPage));
            setCommentsError('');
        } catch (error) {
            setCommentsError(error.message || 'Unable to load more comments.');
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleLike = async () => {
        if (likeLoading) return;
        setLikeLoading(true);
        try {
            const response = await toggleLike(item.id, liked);
            const nextLiked = Boolean(response?.liked ?? !liked);
            setLiked(nextLiked);
            setLikesCount((count) => Math.max(0, count + (nextLiked ? 1 : -1)));
        } catch (error) {
            setCommentsError(error.message || 'Unable to update like.');
        } finally {
            setLikeLoading(false);
        }
    };

    const handleAddComment = async (event) => {
        event.preventDefault();
        const content = commentText.trim();
        if (!content || commentSubmitting) return;
        setCommentSubmitting(true);
        try {
            const newComment = await addComment(item.id, content);
            setComments((current) => [newComment, ...current.filter((comment) => comment.id !== newComment.id)]);
            setCommentsCount((count) => count + 1);
            setCommentText('');
            setCommentsError('');
        } catch (error) {
            setCommentsError(error.message || 'Unable to add comment.');
        } finally {
            setCommentSubmitting(false);
        }
    };

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-3 sm:p-6" onMouseDown={onClose}>
            <div onMouseDown={(event) => event.stopPropagation()} className="relative grid max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-xl bg-white text-gray-900 dark:bg-[#1d1d1d] dark:text-white md:grid-cols-[1.2fr_0.8fr]">
                <button type="button" aria-label="Close post" onClick={onClose} className="absolute right-3 top-3 z-20 rounded-full bg-black/60 p-2 text-white"><FaTimes /></button>
                <div className="relative flex min-h-[300px] items-center justify-center bg-black md:min-h-[70vh]">
                    {media.length > 0 && (type === 'reel'
                        ? <video src={media[activeMedia]?.url} poster={item.thumbnailUrl || undefined} controls autoPlay muted playsInline className="max-h-[90vh] w-full object-contain" />
                        : <img src={media[activeMedia]?.url} alt="Post" className="max-h-[90vh] w-full object-contain" />)}
                    {media.length > 1 && (
                        <>
                            <button type="button" aria-label="Previous media" onClick={() => setActiveMedia((index) => (index === 0 ? media.length - 1 : index - 1))} className="absolute left-3 rounded-full bg-black/60 p-2 text-white"><FaChevronLeft /></button>
                            <button type="button" aria-label="Next media" onClick={() => setActiveMedia((index) => (index + 1) % media.length)} className="absolute right-3 rounded-full bg-black/60 p-2 text-white"><FaChevronRight /></button>
                        </>
                    )}
                </div>
                <div className="flex min-h-0 flex-col p-5 md:max-h-[90vh]">
                    <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
                        <img src={item.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`} alt="" className="h-10 w-10 rounded-full object-cover" />
                        <div><p className="text-sm font-semibold">{userName}</p><p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p></div>
                        {canManage && (
                            <div className="ml-auto flex items-center gap-2 pr-8">
                                <button type="button" title={`Edit ${type}`} aria-label={`Edit ${type}`} onClick={onEdit} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"><FaEdit /></button>
                                <button type="button" title={`Delete ${type}`} aria-label={`Delete ${type}`} onClick={onDelete} className="rounded-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"><FaTrash /></button>
                            </div>
                        )}
                    </div>
                    {item.caption && (
                        <div className="max-h-32 shrink-0 overflow-y-auto py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            <ProfileExpandableText content={item.caption} />
                        </div>
                    )}
                    <div className="min-h-[112px] min-w-0 flex-1 overflow-y-auto border-t border-gray-200 py-4 pr-2 text-sm dark:border-gray-700 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <h3 className="mb-4 text-sm font-semibold">Comments</h3>
                        {comments.length === 0 && !commentsLoading ? (
                            <p className="text-sm text-gray-500">No comments yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex items-start">
                                        <img src={comment.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.userName || 'User')}`} alt={comment.user?.userName || 'User'} className="mr-3 h-8 w-8 shrink-0 cursor-pointer rounded-full object-cover" />
                                        <div className="min-w-0 flex-1">
                                            <p><span className="cursor-pointer font-bold">{comment.user?.userName || 'User'}</span></p>
                                            <ProfileExpandableText content={comment.content} />
                                            <p className="mt-1 text-xs text-gray-500 dark:text-white">{formatDate(comment.createdAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {commentsError && <p className="mt-3 text-xs text-red-500">{commentsError}</p>}
                        {hasMoreComments && <button type="button" onClick={loadMoreComments} disabled={commentsLoading} className="mt-4 text-sm font-semibold text-blue-600 disabled:opacity-60">{commentsLoading ? 'Loading...' : 'Load more comments'}</button>}
                        {commentsLoading && comments.length === 0 && <p className="text-sm text-gray-500">Loading comments...</p>}
                    </div>
                    <div className="flex gap-5 border-t border-gray-200 pt-4 text-sm dark:border-gray-700">
                        <button type="button" onClick={handleLike} disabled={likeLoading} aria-label={liked ? 'Unlike' : 'Like'} className="inline-flex items-center gap-2 disabled:opacity-60">
                            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}{likesCount.toLocaleString()}
                        </button>
                        <span className="inline-flex items-center gap-2"><FaComment />{commentsCount.toLocaleString()}</span>
                    </div>
                    <p className="mt-3 text-xs uppercase text-gray-500">{formatDate(item.createdAt)}</p>
                    <form onSubmit={handleAddComment} className="mt-3 flex h-10 shrink-0">
                        <input value={commentText} onChange={(event) => setCommentText(event.target.value)} maxLength={1000} placeholder="Add a comment..." aria-label="Add a comment" className="min-w-0 flex-1 rounded-l-[10px] border border-[#ddd] bg-white px-3 text-xs text-black outline-none" />
                        <button type="submit" disabled={!commentText.trim() || commentSubmitting} aria-label={commentSubmitting ? 'Posting comment' : 'Post comment'} className="comment-submit-button cursor-pointer rounded-r-[10px] px-3 text-xs font-semibold text-white disabled:opacity-60">{commentSubmitting ? <FaPlaneDeparture className="plane-departure-animation" /> : <FaPlane />}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('Posts');
    const { user: sessionUser } = getStoredSession();
    const userId = sessionUser?.id;
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [reels, setReels] = useState([]);
    const [reelsLoaded, setReelsLoaded] = useState(false);
    const [tabLoading, setTabLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editorOpen, setEditorOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [connectionsModal, setConnectionsModal] = useState(null);
    const [avatarAction, setAvatarAction] = useState(null);
    const [avatarSaving, setAvatarSaving] = useState(false);
    const avatarInputRef = useRef(null);
    const reelsRequestStarted = useRef(false);

    useEffect(() => {
        if (!userId) {
            setError('Sign in to view your profile.');
            setLoading(false);
            return undefined;
        }
        let active = true;
        const loadProfile = async () => {
            const [profileResult, postsResult] = await Promise.allSettled([
                    fetchUserProfile(userId),
                    fetchUserPosts(),
            ]);
            if (!active) return;

            if (profileResult.status === 'fulfilled') {
                setProfile(profileResult.value);
                setError('');
            } else {
                setError(profileResult.reason.message || 'Unable to load profile.');
            }

            if (postsResult.status === 'fulfilled') {
                setPosts(postsResult.value?.items || []);
            } else if (profileResult.status === 'fulfilled') {
                setError(postsResult.reason.message || 'Unable to load posts.');
            }
            setLoading(false);
        };
        loadProfile();
        return () => { active = false; };
    }, [userId]);

    useEffect(() => {
        if (activeTab !== 'Reels' || !userId || !profile || reelsLoaded || reelsRequestStarted.current) return;
        if ((profile._count?.reels ?? 0) === 0) {
            setReelsLoaded(true);
            return;
        }
        reelsRequestStarted.current = true;
        setTabLoading(true);
        fetchUserReels(userId)
            .then((reelsData) => {
                setReels(reelsData?.items || []);
                setReelsLoaded(true);
                setError('');
            })
            .catch((loadError) => {
                reelsRequestStarted.current = false;
                setError(loadError.message || 'Unable to load reels.');
            })
            .finally(() => setTabLoading(false));
    }, [activeTab, profile, reelsLoaded, userId]);

    const saveProfile = async (values) => {
        const updatedProfile = await updateUserProfile(values);
        setProfile(updatedProfile);
        setEditorOpen(false);
    };

    const refreshProfileContent = async (type) => {
        try {
            if (type === 'reel') {
                const response = await fetchUserReels(userId);
                setReels(response?.items || []);
            } else {
                const response = await fetchUserPosts();
                setPosts(response?.items || []);
            }
        } catch (refreshError) {
            setError(refreshError.message || 'Unable to refresh profile content.');
        }
    };

    const handleDeleteContent = async (item, type) => {
        if (!window.confirm(`Delete this ${type}?`)) return;
        try {
            if (type === 'reel') {
                await deleteReel(item.id);
                setReels((current) => current.filter((reel) => reel.id !== item.id));
            } else {
                await deletePost(item.id);
                setPosts((current) => current.filter((post) => post.id !== item.id));
            }
            setProfile((current) => current ? {
                ...current,
                _count: {
                    ...current._count,
                    [type === 'reel' ? 'reels' : 'posts']: Math.max(0, (current._count?.[type === 'reel' ? 'reels' : 'posts'] || 0) - 1),
                },
            } : current);
            setSelectedContent(null);
        } catch (deleteError) {
            setError(deleteError.message || `Unable to delete ${type}.`);
        }
    };

    const confirmAvatarAction = async () => {
        if (!avatarAction || avatarSaving) return;
        setAvatarSaving(true);
        setError('');
        try {
            const updatedProfile = await updateUserProfile({
                profile: profile.profile || '',
                image: avatarAction.type === 'change' ? avatarAction.image : undefined,
                removeImage: avatarAction.type === 'remove',
            });
            setProfile(updatedProfile);
            setAvatarAction(null);
        } catch (updateError) {
            setError(updateError.message || 'Unable to update profile picture.');
        } finally {
            setAvatarSaving(false);
        }
    };

    const tabs = [
        {
            name: 'Posts',
            label: 'Posts',
            icon: (
                <svg width="18" height="18" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_201_521)">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18.6 2.06667H12.4V9.3H18.6V2.06667ZM10.3333 2.06667V9.3H2.06667V4.13333C2.06667 2.99195 2.99195 2.06667 4.13333 2.06667H10.3333ZM10.3333 11.3667H2.06667V18.6H10.3333V11.3667ZM10.3333 20.6667H2.06667V26.8667C2.06667 28.0081 2.99195 28.9333 4.13333 28.9333H10.3333V20.6667ZM0 20.6667V18.6V11.3667V9.3V4.13333C0 1.85056 1.85056 0 4.13333 0H10.3333H12.4H26.8667C29.1495 0 31 1.85056 31 4.13333V26.8667C31 29.1495 29.1495 31 26.8667 31H20.6667H18.6H4.13333C1.85056 31 0 29.1495 0 26.8667V20.6667ZM12.4 20.6667H18.6V28.9333H12.4V20.6667ZM18.6 18.6H12.4V11.3667H18.6V18.6ZM20.6667 20.6667V28.9333H26.8667C28.0081 28.9333 28.9333 28.0081 28.9333 26.8667V20.6667H20.6667ZM28.9333 18.6V11.3667H20.6667V18.6H28.9333ZM28.9333 4.13333V9.3H20.6667V2.06667H26.8667C28.0081 2.06667 28.9333 2.99195 28.9333 4.13333Z"
                            fill={activeTab === 'Posts' ? '#1E90FF' : '#8D8D8D'}
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_201_521">
                            <rect width="31" height="31" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            )
        },
        {
            name: 'Reels',
            label: 'Reels',
            icon: (
                <svg width="18" height="18" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.1305 2.48132H10.011L13.23 7.27821L20.2398 7.18466L17.1305 2.48132ZM6.61686 2.48132H8.01885L11.2555 7.30456L2.48132 7.42167V6.61686C2.48132 4.33287 4.33287 2.48132 6.61686 2.48132ZM19.1135 2.48132L22.2054 7.15842L28.5187 7.07415V6.61686C28.5187 4.33287 26.6671 2.48132 24.3831 2.48132H19.1135ZM2.48132 24.3831V9.9032L28.5187 9.55573V24.3831C28.5187 26.6671 26.6671 28.5187 24.3831 28.5187H6.61686C4.33287 28.5187 2.48132 26.6671 2.48132 24.3831ZM6.61686 0C2.96247 0 0 2.96248 0 6.61686V24.3831C0 28.0375 2.96247 31 6.61686 31H24.3831C28.0375 31 31 28.0375 31 24.3831V6.61686C31 2.96247 28.0375 0 24.3831 0H6.61686ZM20.8982 19.6062C21.4445 19.2791 21.432 18.4834 20.8757 18.1737L13.5955 14.1218C13.0391 13.8121 12.3562 14.2209 12.3663 14.8575L12.4973 23.1883C12.5073 23.8249 13.2026 24.212 13.749 23.885L20.8982 19.6062Z" fill={activeTab === 'Reels' ? '#1E90FF' : '#8D8D8D'} />
                </svg>
            )
        },
        {
            name: 'Saved',
            icon: (
                <svg width="18" height="18" viewBox="0 0 26 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M25 28.2398C25 29.8419 23.2105 30.7937 21.8821 29.8982L14.1179 24.6645C13.4422 24.209 12.5578 24.209 11.8821 24.6645L4.11791 29.8982C2.78951 30.7937 1 29.8419 1 28.2398V3C1 1.89543 1.89543 1 3 1H23C24.1046 1 25 1.89543 25 3V28.2398Z"
                        stroke={activeTab === 'Saved' ? '#1E90FF' : '#8D8D8D'} // Blue when active, gray otherwise
                        strokeWidth="2"
                        strokeMiterlimit="10"
                    />
                </svg>
            )
        }
    ];

    const filteredData = activeTab === 'Posts' ? posts : activeTab === 'Reels' ? reels : [];
    const displayName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.userName : '';
    const profileImage = profile?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.userName || 'User')}`;

    return (
        <div className="profile h-full">
            <div className="flex items-center pt-4 pb-8 profile-div">
                <div className="bg-[#EFEFEF] dark:bg-[#ffffff1c] h-full shadow-lg rounded-3xl flex overflow-hidden w-full flex-col">
                    <div className="flex flex-col items-center main-profile">
                        <div className="flex w-full gap-6 items-start p-6 user-profile">
                            <div className="group relative h-32 w-32 shrink-0 sm:h-40 sm:w-40">
                                <div className="user-profile-img absolute inset-0 overflow-hidden rounded-full bg-story">
                                    <img src={profileImage} alt="Profile" className="h-full w-full rounded-full object-cover p-[2px]" />
                                    <button type="button" title="Change profile picture" aria-label="Change profile picture" onClick={() => avatarInputRef.current?.click()} className="absolute inset-0 grid place-items-center rounded-full bg-black/45 text-xl text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                                        <FaCamera />
                                    </button>
                                </div>
                                {profile?.profileImage && <button type="button" title="Remove profile picture" aria-label="Remove profile picture" onClick={() => setAvatarAction({ type: 'remove' })} className="absolute -right-1 -top-1 z-20 rounded-full bg-black/75 p-2 text-sm text-white opacity-0 shadow transition-opacity hover:bg-red-600 group-hover:opacity-100 focus:opacity-100">
                                    <FaTrash />
                                </button>}
                                <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => {
                                    const image = event.target.files?.[0];
                                    event.target.value = '';
                                    if (image) setAvatarAction({ type: 'change', image });
                                }} />
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col user-profile-deatil">
                                <h1 className="break-words text-2xl font-semibold text-gray-900 dark:text-white">{displayName || profile?.userName || 'Loading profile...'}</h1>
                                <p className="mb-1 mt-[5px] text-sm text-gray-500 dark:text-white">@{profile?.userName || ''}</p>

                                <div className="mb-[10px] mt-[10px] flex flex-wrap gap-x-5 gap-y-2">
                                    <div className="text-center flex items-center gap-[6px] cursor-pointer">
                                        <span className="font-bold text-[14px] dark:text-white">{(profile?._count?.posts ?? 0) + (profile?._count?.reels ?? 0)}</span>
                                        <p className="text-sm text-gray-500 dark:text-white">Posts</p>
                                    </div>
                                    <button type="button" onClick={() => setConnectionsModal('followers')} className="text-center flex items-center gap-[6px] cursor-pointer">
                                        <span className="font-bold text-[14px] dark:text-white">{profile?._count?.followers ?? 0}</span>
                                        <p className="text-sm text-gray-500 dark:text-white">Followers</p>
                                    </button>
                                    <button type="button" onClick={() => setConnectionsModal('following')} className="text-center flex items-center gap-[6px] cursor-pointer">
                                        <span className="font-bold text-[14px] dark:text-white">{profile?._count?.following ?? 0}</span>
                                        <p className="text-sm text-gray-500 dark:text-white">Following</p>
                                    </button>
                                </div>

                                {profile?.profile && <p className="whitespace-pre-wrap break-words text-sm text-gray-700 dark:text-gray-200">{profile.profile}</p>}
                                <button type="button" onClick={() => setEditorOpen(true)} disabled={!profile} className="edit-btn mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
                                    <FaEdit />
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {error && <p className="px-6 pb-3 text-sm text-red-500">{error}</p>}

                        <div className="p-6 w-full flex flex-col items-center">
                            <div className="flex space-x-6 ml-[8rem] profile-tabs">
                                {tabs.map(({ name, icon }) => (
                                    <button
                                        type="button"
                                        key={name}
                                        onClick={() => setActiveTab(name)}
                                        className={`flex items-center space-x-2 text-sm ${activeTab === name ? 'text-blue-600 dark:text-white underline font-bold' : 'text-gray-500 dark:text-white font-medium'}`}
                                    >
                                        {icon}
                                        <span>
                                            {name}
                                            {profile && name === 'Posts' && ` (${profile._count?.posts ?? 0})`}
                                            {profile && name === 'Reels' && ` (${profile._count?.reels ?? 0})`}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="container mx-auto mt-6">
                                {loading ? (
                                    <p className="py-10 text-center text-sm text-gray-500">Loading profile...</p>
                                ) : activeTab === 'Saved' ? (
                                    <p className="py-10 text-center text-sm text-gray-500">Saved posts are not available yet.</p>
                                ) : tabLoading ? (
                                    <p className="py-10 text-center text-sm text-gray-500">Loading reels...</p>
                                ) : filteredData.length === 0 ? (
                                    <p className="py-10 text-center text-sm text-gray-500">No {activeTab.toLowerCase()} yet.</p>
                                ) : (
                                <div className="grid-profile grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
                                    {filteredData.map((content) => {
                                        const isReel = activeTab === 'Reels';
                                        const mediaUrl = isReel
                                            ? (content.thumbnailUrl || content.media?.[0]?.url || content.videoUrl)
                                            : content.media?.[0]?.url;
                                        return (
                                            <button key={content.id} type="button" onClick={() => setSelectedContent({ item: content, type: isReel ? 'reel' : 'post' })} className="group relative aspect-square overflow-hidden rounded-lg bg-black text-left">
                                                {isReel ? (
                                                    <video src={content.media?.[0]?.url || content.videoUrl} poster={content.thumbnailUrl || undefined} muted preload="metadata" className="h-full w-full object-cover transition duration-300 group-hover:opacity-75" />
                                                ) : (
                                                    <img src={mediaUrl} alt={content.caption || 'Post'} className="h-full w-full object-cover transition duration-300 group-hover:opacity-75" />
                                                )}
                                                {isReel && <FaPlay className="absolute right-3 top-3 text-white drop-shadow" />}
                                                {content.media?.length > 1 && <span className="absolute right-3 top-3 rounded bg-black/50 px-2 py-1 text-xs text-white">{content.media.length}</span>}
                                                <span className="absolute inset-0 flex items-center justify-center gap-5 bg-black/45 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                                                    <span className="inline-flex items-center gap-2"><FaHeart />{content.likesCount || 0}</span>
                                                    <span className="inline-flex items-center gap-2"><FaComment />{content.commentsCount || 0}</span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {editorOpen && profile && <ProfileEditor profile={profile} onClose={() => setEditorOpen(false)} onSave={saveProfile} />}
            {avatarAction && profile && <AvatarConfirmation action={avatarAction} profile={profile} saving={avatarSaving} onCancel={() => !avatarSaving && setAvatarAction(null)} onConfirm={confirmAvatarAction} />}
            {selectedContent && <ProfileContentModal
                key={`${selectedContent.type}-${selectedContent.item.id}`}
                item={selectedContent.item}
                type={selectedContent.type}
                canManage={selectedContent.item.user?.id === userId}
                onClose={() => setSelectedContent(null)}
                onEdit={() => {
                    setEditingItem({ ...selectedContent.item, contentType: selectedContent.type });
                    setSelectedContent(null);
                }}
                onDelete={() => handleDeleteContent(selectedContent.item, selectedContent.type)}
            />}
            {editingItem && <UploadModal
                editItem={editingItem}
                onClose={() => setEditingItem(null)}
                onSaved={refreshProfileContent}
            />}
            {connectionsModal && <ProfileConnectionsModal userId={userId} initialTab={connectionsModal} onClose={() => setConnectionsModal(null)} />}
        </div>
    );
};

export default UserProfile;
