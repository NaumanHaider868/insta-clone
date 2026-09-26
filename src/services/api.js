const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const readStoredSession = () => {
  try {
    const token = localStorage.getItem("insta_token");
    const user = localStorage.getItem("insta_user");
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  } catch {
    return { token: null, user: null };
  }
};

const persistSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem("insta_token", token);
  }
  if (user) {
    localStorage.setItem("insta_user", JSON.stringify(user));
  }
};

export const clearSession = () => {
  localStorage.removeItem("insta_token");
  localStorage.removeItem("insta_user");
};

export const getStoredSession = () => readStoredSession();

const MAX_MEDIA_SIZE = 10 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime", "video/webm", "video/x-matroska", "video/mkv"]);

const validateFile = (file, allowedTypes, label) => {
  if (!file || !allowedTypes.has(file.type)) {
    throw new Error(`Unsupported ${label} type.`);
  }
  if (file.size > MAX_MEDIA_SIZE) {
    throw new Error("File size must be 10 MB or smaller.");
  }
};

export const apiRequest = async (path, options = {}) => {
  const { token } = readStoredSession();
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers || {});

  if (!isFormData && !headers.has("Content-Type") && !(options.body instanceof URLSearchParams)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.error || payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload?.data ?? payload;
};

export const loginUser = async ({ email, password }) => {
  const payload = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (payload?.token && payload?.user) {
    persistSession({ token: payload.token, user: payload.user });
  }

  return payload;
};

export const registerUser = async ({ userName, firstName, lastName, email, password }) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ userName, firstName, lastName, email, password }),
  });
};

export const fetchHomeFeed = async () => {
  return apiRequest("/posts/feed");
};

export const fetchReelsFeed = async (page = 1, limit = 10) => {
  return apiRequest(`/reels/feed?page=${page}&limit=${limit}`);
};

export const fetchSuggestions = async () => {
  return apiRequest("/user/suggestions");
};

export const fetchChatConversations = async () => {
  return apiRequest("/chat/conversations");
};

export const fetchChatConversation = async (userId) => {
  return apiRequest(`/chat/single/${userId}`);
};

export const searchChatUsers = async (query) => {
  return apiRequest(`/chat/users?q=${encodeURIComponent(query)}`);
};

export const sendChatMessage = async ({ receiverId, content }) => {
  return apiRequest("/chat/send", {
    method: "POST",
    body: JSON.stringify({ receiverId, content }),
  });
};

export const fetchUserProfile = async (userId) => {
  return apiRequest(`/user/profile/${userId}`);
};

export const fetchUserPosts = async (userId, page = 1, limit = 100) => {
  return apiRequest(`/posts/user/${userId}?page=${page}&limit=${limit}`);
};

export const fetchUserReels = async (userId, page = 1, limit = 100) => {
  return apiRequest(`/reels/user/${userId}?page=${page}&limit=${limit}`);
};

export const updateUserProfile = async ({ profile, image, removeImage = false }) => {
  if (image) validateFile(image, IMAGE_TYPES, "profile image");
  const formData = new FormData();
  formData.append("profile", profile);
  if (image) formData.append("image", image);
  if (removeImage) formData.append("removeProfileImage", "true");

  const updatedUser = await apiRequest("/user/profile", {
    method: "PUT",
    body: formData,
  });
  const { token, user } = readStoredSession();
  if (user) persistSession({ token, user: { ...user, ...updatedUser } });
  return updatedUser;
};

export const followUser = async (userId) => {
  return apiRequest(`/follow/${userId}`, { method: "POST" });
};

export const toggleLikePost = async (postId, isLiked) => {
  return apiRequest(`/posts/${postId}/like`, {
    method: isLiked ? "DELETE" : "POST",
  });
};

export const toggleLikeReel = async (reelId, isLiked) => {
  return apiRequest(`/reels/${reelId}/like`, {
    method: isLiked ? "DELETE" : "POST",
  });
};

export const fetchPostComments = async (postId, page = 1, limit = 10) => {
  return apiRequest(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
};

export const addPostComment = async (postId, content) => {
  return apiRequest(`/posts/${postId}/comment`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
};

export const fetchReelComments = async (reelId, page = 1, limit = 10) => {
  return apiRequest(`/reels/${reelId}/comments?page=${page}&limit=${limit}`);
};

export const addReelComment = async (reelId, content) => {
  return apiRequest(`/reels/${reelId}/comment`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
};

export const createPost = async ({ caption, files }) => {
  files.forEach((file) => validateFile(file, IMAGE_TYPES, "image"));
  const formData = new FormData();
  if (caption) {
    formData.append("caption", caption);
  }
  files.forEach((file) => formData.append("images", file));

  return apiRequest("/posts", {
    method: "POST",
    body: formData,
  });
};

export const updatePost = async ({ postId, caption, files, retainedMediaIds }) => {
  files.forEach((file) => validateFile(file, IMAGE_TYPES, "image"));
  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("retainedMediaIds", JSON.stringify(retainedMediaIds));
  files.forEach((file) => formData.append("images", file));

  return apiRequest(`/posts/${postId}`, {
    method: "PUT",
    body: formData,
  });
};

export const createReel = async ({ caption, videos, video, thumbnail }) => {
  const selectedVideos = videos || (video ? [video] : []);
  selectedVideos.forEach((file) => validateFile(file, VIDEO_TYPES, "video"));
  if (thumbnail) validateFile(thumbnail, IMAGE_TYPES, "thumbnail");
  const formData = new FormData();
  if (caption) {
    formData.append("caption", caption);
  }
  selectedVideos.forEach((file) => formData.append("video", file));
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }

  return apiRequest("/reels", {
    method: "POST",
    body: formData,
  });
};

export const updateReel = async ({ reelId, caption, videos, retainedMediaIds }) => {
  videos.forEach((file) => validateFile(file, VIDEO_TYPES, "video"));
  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("retainedMediaIds", JSON.stringify(retainedMediaIds));
  videos.forEach((file) => formData.append("video", file));

  return apiRequest(`/reels/${reelId}`, {
    method: "PUT",
    body: formData,
  });
};

export const deleteReel = async (reelId) => {
  return apiRequest(`/reels/${reelId}`, { method: "DELETE" });
};
