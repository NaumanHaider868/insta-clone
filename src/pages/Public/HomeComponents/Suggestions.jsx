import { useEffect, useState } from "react";
import "../../../assets/css/style.scss";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Link } from "react-router-dom";
import { fetchSuggestions, followUser } from "../../../services/api";

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingId, setFollowingId] = useState(null);
  const [toast, setToast] = useState({ open: false, severity: "success", message: "" });

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetchSuggestions();
      setSuggestions(response?.items || []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    if (followingId) return;
    setFollowingId(userId);
    try {
      await followUser(userId);
      setSuggestions((current) => current.filter((suggestion) => suggestion.id !== userId));
      setToast({ open: true, severity: "success", message: "User followed successfully." });
    } catch (followError) {
      setToast({
        open: true,
        severity: "error",
        message: followError.message || "Unable to follow this user.",
      });
    } finally {
      setFollowingId(null);
    }
  };

  return (
    <>
      <div className="w-[250px] ml-7">
        {/* <div className="actions w-full flex justify-end">
          <div className="story-row flex pr-0">
            <div className="next-button mr-5">
              <div className="circle">
                <i className="create-icon"></i>
              </div>
            </div>
            <div className="next-button">
              <div className="circle">
                <i className="action-icon"></i>
              </div>
            </div>
          </div>
        </div> */}
        <div className="suggestions dark:bg-[#ffffff1c]">
          <div className="suggestions-header">
            <span className="text-[#919191] text-[15px] dark:text-white">
              Suggested For You:
            </span>
            <Link to="/see-all" className="dark:!text-white">See All</Link>
          </div>
          <div className="suggestions-list">
            {loading && <p className="px-3 py-4 text-sm text-gray-500">Loading suggestions...</p>}
            {!loading && suggestions.length === 0 && <p className="px-3 py-4 text-sm text-gray-500">No suggestions right now.</p>}
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="suggestion-item">
                <img src={suggestion.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(suggestion.userName)} alt={suggestion.userName} className="suggestion-avatar" />
                <span className="suggestion-username dark:!text-white">
                  {suggestion.userName}
                </span>
                <button type="button" className="follow-link" onClick={() => handleFollow(suggestion.id)} disabled={followingId === suggestion.id}>
                  {followingId === suggestion.id ? "..." : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast((current) => ({ ...current, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Suggestions;
