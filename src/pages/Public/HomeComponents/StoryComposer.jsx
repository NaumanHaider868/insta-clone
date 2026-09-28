import { useEffect, useState } from "react";
import { FaImage, FaTimes, FaVideo } from "react-icons/fa";
import { createStory } from "../../../services/api";

const STORY_BACKGROUNDS = ["#1e3a8a", "#be123c", "#047857", "#92400e", "#111827"];
const IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime", "video/webm", "video/x-matroska", "video/mkv"]);
const MAX_STORY_SIZE = 10 * 1024 * 1024;

const StoryComposer = ({ onClose, onCreated }) => {
  const [type, setType] = useState("IMAGE");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [background, setBackground] = useState(STORY_BACKGROUNDS[0]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, saving]);

  const changeType = (nextType) => {
    setType(nextType);
    setFile(null);
    setError("");
  };

  const chooseFile = (event) => {
    const selected = event.target.files?.[0] || null;
    event.target.value = "";
    if (!selected) return;
    const validTypes = type === "IMAGE" ? IMAGE_TYPES : VIDEO_TYPES;
    if (!validTypes.has(selected.type)) {
      setError(`Choose a supported ${type.toLowerCase()} file.`);
      return;
    }
    if (selected.size > MAX_STORY_SIZE) {
      setError("Story files must be 10 MB or smaller.");
      return;
    }
    setFile(selected);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    if (type !== "TEXT" && !file) {
      setError(`Choose a ${type.toLowerCase()} for your story.`);
      return;
    }
    if (type === "TEXT" && !text.trim()) {
      setError("Write something for your story.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await createStory({ type, file, text: text.trim(), background });
      await onCreated();
      onClose();
    } catch (saveError) {
      setError(saveError.message || "Unable to upload story.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 p-4" onMouseDown={() => !saving && onClose()}>
      <section role="dialog" aria-modal="true" aria-label="Create story" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-xl bg-white text-gray-900 shadow-2xl dark:bg-[#1d1d1d] dark:text-white">
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h2 className="text-base font-semibold">Create story</h2>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close story composer" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-white/10"><FaTimes /></button>
        </header>

        <form onSubmit={submit} className="space-y-4 p-5">
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-white/10">
            {["IMAGE", "VIDEO", "TEXT"].map((storyType) => (
              <button key={storyType} type="button" onClick={() => changeType(storyType)} className={`rounded-md px-2 py-2 text-sm font-semibold ${type === storyType ? "bg-white shadow dark:bg-white/20" : "text-gray-500 dark:text-gray-300"}`}>
                {storyType === "IMAGE" ? <FaImage className="mr-2 inline" /> : storyType === "VIDEO" ? <FaVideo className="mr-2 inline" /> : null}
                {storyType[0] + storyType.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {type === "TEXT" ? (
            <div className="space-y-3">
              <div className="flex min-h-64 items-center justify-center rounded-lg p-5" style={{ backgroundColor: background }}>
                <textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={500} rows={5} autoFocus aria-label="Story text" placeholder="Write a story..." className="w-full resize-none bg-transparent text-center text-xl font-semibold text-white outline-none placeholder:text-white/60" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2" aria-label="Text story background">
                  {STORY_BACKGROUNDS.map((color) => (
                    <button key={color} type="button" onClick={() => setBackground(color)} aria-label={`Use ${color} background`} aria-pressed={background === color} className={`h-7 w-7 rounded-full border-2 ${background === color ? "border-blue-500" : "border-transparent"}`} style={{ backgroundColor: color }} />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{text.length}/500</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {previewUrl ? (
                type === "IMAGE" ? (
                  <img src={previewUrl} alt="Story preview" className="max-h-[55vh] w-full rounded-lg bg-black object-contain" />
                ) : (
                  <video src={previewUrl} controls className="max-h-[55vh] w-full rounded-lg bg-black object-contain" />
                )
              ) : (
                <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 text-center hover:border-gray-500 dark:border-gray-600">
                  {type === "IMAGE" ? <FaImage className="mb-3 text-2xl text-gray-500" /> : <FaVideo className="mb-3 text-2xl text-gray-500" />}
                  <span className="text-sm font-semibold">Choose {type.toLowerCase()}</span>
                  <span className="mt-1 text-xs text-gray-500">Image or video up to 10 MB</span>
                  <input type="file" accept={type === "IMAGE" ? "image/jpeg,image/png,image/webp" : "video/mp4,video/quicktime,video/webm,video/x-matroska"} onChange={chooseFile} className="sr-only" />
                </label>
              )}
              {previewUrl && <button type="button" onClick={() => setFile(null)} className="text-sm font-semibold text-blue-600">Choose another file</button>}
              <textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={500} rows={2} aria-label="Optional story text" placeholder="Add text (optional)" className="w-full resize-none rounded-lg border border-gray-200 bg-transparent p-3 text-sm outline-none focus:border-gray-500 dark:border-gray-700" />
            </div>
          )}

          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={saving} className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {saving ? "Sharing..." : "Share story"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default StoryComposer;