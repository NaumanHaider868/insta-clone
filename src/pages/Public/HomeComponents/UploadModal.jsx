import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiImage, FiLoader, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import { createPost, createReel, updatePost, updateReel } from "../../../services/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime", "video/webm", "video/x-matroska", "video/mkv"]);

const validateFile = (file, types, label) => {
  if (!types.has(file.type)) {
    throw new Error(`Unsupported ${label} type.`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be 10 MB or smaller.");
  }
};

const UploadModal = ({ onClose, editItem = null, onSaved }) => {
  const [mode, setMode] = useState(editItem?.contentType === "reel" ? "reel" : "post");
  const [caption, setCaption] = useState(editItem?.caption || "");
  const [retainedMedia, setRetainedMedia] = useState(editItem?.media || []);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const previewUrls = useRef(new Set());

  const createPreview = (file) => {
    const preview = URL.createObjectURL(file);
    previewUrls.current.add(preview);
    return preview;
  };

  const releasePreview = (preview) => {
    if (!preview) return;
    URL.revokeObjectURL(preview);
    previewUrls.current.delete(preview);
  };

  const closeModal = () => {
    if (isUploading) return;
    previewUrls.current.forEach((preview) => URL.revokeObjectURL(preview));
    previewUrls.current.clear();
    onClose();
  };

  const addImages = (event) => {
    setError("");
    const selected = Array.from(event.target.files || []);
    try {
      selected.forEach((file) => validateFile(file, IMAGE_TYPES, "image"));
      if (retainedMedia.length + images.length + selected.length > 10) {
        throw new Error("A post can contain at most 10 images.");
      }
      setImages((current) => [
        ...current,
        ...selected.map((file) => ({ file, preview: createPreview(file) })),
      ]);
    } catch (uploadError) {
      setError(uploadError.message);
    }
    event.target.value = "";
  };

  const addVideo = (event) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    if (selected.length === 0) return;
    try {
      selected.forEach((file) => validateFile(file, VIDEO_TYPES, "video"));
      if (retainedMedia.length + videos.length + selected.length > 1) {
        throw new Error("A reel can contain only one video.");
      }
      setError("");
      setVideos((current) => [
        ...current,
        ...selected.map((file) => ({ file, preview: createPreview(file) })),
      ]);
    } catch (uploadError) {
      setError(uploadError.message);
    }
  };

  const addThumbnail = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      validateFile(file, IMAGE_TYPES, "thumbnail");
      setError("");
      if (thumbnail) releasePreview(thumbnail.preview);
      setThumbnail({ file, preview: createPreview(file) });
    } catch (uploadError) {
      setError(uploadError.message);
    }
  };

  const submitUpload = async (event) => {
    event.preventDefault();
    if (isUploading) return;
    setError("");

    if (mode === "post" && retainedMedia.length + images.length === 0) {
      setError("Select at least one image for your post.");
      return;
    }
    if (mode === "reel" && retainedMedia.length + videos.length === 0) {
      setError("Select at least one video for your reel.");
      return;
    }
    if (mode === "reel" && retainedMedia.length + videos.length > 1) {
      setError("A reel can contain only one video.");
      return;
    }

    setIsUploading(true);
    try {
      if (mode === "post") {
        if (editItem) {
          await updatePost({
            postId: editItem.id,
            caption,
            files: images.map((item) => item.file),
            retainedMediaIds: retainedMedia.map((item) => item.id),
          });
        } else {
          await createPost({ caption, files: images.map((item) => item.file) });
        }
      } else {
        if (editItem) {
          await updateReel({
            reelId: editItem.id,
            caption,
            videos: videos.map((item) => item.file),
            retainedMediaIds: retainedMedia.map((item) => item.id),
          });
        } else {
          await createReel({ caption, videos: videos.map((item) => item.file), thumbnail: thumbnail?.file });
        }
      }
      window.dispatchEvent(new Event("instagram:content-created"));
      onSaved?.(mode);
      previewUrls.current.forEach((preview) => URL.revokeObjectURL(preview));
      previewUrls.current.clear();
      onClose();
    } catch (uploadError) {
      setError(uploadError.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const switchMode = (nextMode) => {
    if (isUploading || nextMode === mode) return;
    setMode(nextMode);
    setError("");
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-5 sm:items-center sm:py-8" onMouseDown={closeModal}>
      <div
        className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 text-black shadow-2xl dark:bg-[#1d1d1d] dark:text-white"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{editItem ? "Edit" : "Create"}</p>
            <h2 className="text-xl font-semibold">{editItem ? `Edit ${mode}` : "Share something new"}</h2>
          </div>
          <button type="button" title="Close upload" aria-label="Close upload" onClick={closeModal} disabled={isUploading} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/10">
            <FiX size={20} />
          </button>
        </div>

        {!editItem && <div className="mb-5 grid grid-cols-2 rounded-xl bg-gray-100 p-1 dark:bg-white/10">
          <button type="button" onClick={() => switchMode("post")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${mode === "post" ? "bg-white shadow-sm dark:bg-white/20" : "text-gray-500"}`}>
            Post
          </button>
          <button type="button" onClick={() => switchMode("reel")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${mode === "reel" ? "bg-white shadow-sm dark:bg-white/20" : "text-gray-500"}`}>
            Reel
          </button>
        </div>}

        <form onSubmit={submitUpload}>
          {mode === "post" ? (
            <>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-6 text-center hover:border-gray-500 dark:border-gray-600">
                <FiImage size={28} className="mb-2 text-gray-500" />
                <span className="text-sm font-semibold">{editItem ? "Add images" : "Choose one or more images"}</span>
                <span className="mt-1 text-xs text-gray-500">JPEG, PNG, or WEBP, up to 10 MB each</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={addImages} disabled={isUploading || retainedMedia.length + images.length >= 10} />
              </label>
              {retainedMedia.length + images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {[...retainedMedia, ...images].map((item, index) => {
                    const isExisting = Boolean(item.id);
                    const preview = isExisting ? item.url : item.preview;
                    return (
                    <div key={item.id || item.preview} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <img src={preview} alt={`Post image ${index + 1}`} className="h-full w-full object-cover" />
                      <button type="button" title="Remove image" aria-label={`Remove image ${index + 1}`} onClick={() => {
                        if (isExisting) {
                          setRetainedMedia((current) => current.filter((media) => media.id !== item.id));
                        } else {
                          releasePreview(item.preview);
                          setImages((current) => current.filter((image) => image.preview !== item.preview));
                        }
                      }} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-6 text-center hover:border-gray-500 dark:border-gray-600">
                <FiUpload size={28} className="mb-2 text-gray-500" />
                <span className="text-sm font-semibold">{editItem ? "Replace video" : "Choose one video"}</span>
                <span className="mt-1 text-xs text-gray-500">MP4, MOV, WEBM, or MKV, up to 10 MB each</span>
                <input type="file" accept="video/mp4,video/quicktime,video/webm,video/x-matroska" className="hidden" onChange={addVideo} disabled={isUploading || retainedMedia.length + videos.length >= 1} />
              </label>
              {retainedMedia.length + videos.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[...retainedMedia, ...videos].map((item, index) => {
                    const isExisting = Boolean(item.id);
                    const preview = isExisting ? item.url : item.preview;
                    return (
                    <div key={item.id || item.preview} className="relative overflow-hidden rounded-xl bg-black">
                      <video src={preview} controls className="max-h-64 w-full" />
                      <button type="button" title="Remove video" aria-label={`Remove video ${index + 1}`} onClick={() => {
                        if (isExisting) {
                          setRetainedMedia((current) => current.filter((media) => media.id !== item.id));
                        } else {
                          releasePreview(item.preview);
                          setVideos((current) => current.filter((video) => video.preview !== item.preview));
                        }
                      }} className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    );
                  })}
                </div>
              )}
              {!editItem && <label className="mt-4 block text-sm font-semibold">
                Thumbnail (optional)
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={addThumbnail} disabled={isUploading} className="mt-2 block w-full text-xs" />
              </label>}
            </>
          )}

          <textarea value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Write a caption..." rows="3" disabled={isUploading} className="mt-5 w-full resize-none rounded-xl border border-gray-200 bg-transparent p-3 text-sm outline-none focus:border-gray-500 dark:border-gray-700" />
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={isUploading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black">
            {isUploading && <FiLoader className="animate-spin" />}
            {isUploading ? "Saving..." : editItem ? "Save changes" : mode === "post" ? "Share post" : "Share reel"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default UploadModal;
