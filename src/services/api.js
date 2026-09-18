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

export const fetchReelsFeed = async () => {
  return apiRequest("/reels/feed");
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

export const fetchPostComments = async (postId) => {
  return apiRequest(`/posts/${postId}/comments`);
};

export const addPostComment = async (postId, content) => {
  return apiRequest(`/posts/${postId}/comment`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
};

export const fetchReelComments = async (reelId) => {
  return apiRequest(`/reels/${reelId}/comments`);
};

export const addReelComment = async (reelId, content) => {
  return apiRequest(`/reels/${reelId}/comment`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
};

export const createPost = async ({ caption, files }) => {
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

export const createReel = async ({ caption, video, thumbnail }) => {
  const formData = new FormData();
  if (caption) {
    formData.append("caption", caption);
  }
  if (video) {
    formData.append("video", video);
  }
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }

  return apiRequest("/reels", {
    method: "POST",
    body: formData,
  });
};
