import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { FaHeart, FaComment, FaShare, FaSave, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const reelsData = [
    {
        id: 1,
        videoUrl: "/src/assets/images/video1.MP4",
        username: "confident_coder",
        likes: 4121,
        comments: 32,
        description: "Ramdan mubarak.",
        profilePic: "/src/assets/images/users-imgs/explore3.jpg",
    },
    {
        id: 2,
        videoUrl: "/src/assets/images/video2.MP4",
        username: "coding_ninja",
        likes: 2450,
        comments: 15,
        description: "Bhai party!",
        profilePic: "/src/assets/images/users-imgs/explore4.jpg",
    },
    {
        id: 3,
        videoUrl: "/src/assets/images/video3.MP4",
        username: "web_dev",
        likes: 6789,
        comments: 45,
        description: "Muje tu kuch pata hi nahi.",
        profilePic: "/src/assets/images/users-imgs/explore5.jpg",
    },
];

const ReelsPage = () => {
    const [currentReelIndex, setCurrentReelIndex] = useState(0);

    const nextReel = (direction) => {
        setCurrentReelIndex((prevIndex) => {
            if (direction === "up") {
                return prevIndex === 0 ? reelsData.length - 1 : prevIndex - 1;
            } else {
                return prevIndex === reelsData.length - 1 ? 0 : prevIndex + 1;
            }
        });
    };

    useEffect(() => {
        const handleScroll = (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                nextReel("up");
            } else {
                nextReel("down");
            }
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
    }, []);

    return (
        <div className="h-screen overflow-hidden flex flex-col items-center justify-center scrollbar-hidden">
            <Reel reel={reelsData[currentReelIndex]} />
        </div>
    );
};

const Reel = ({ reel }) => {
    const [playing, setPlaying] = useState(true);
    const [muted, setMuted] = useState(true);

    const handleVideoClick = () => {
        setPlaying((prev) => !prev);
    };

    const toggleMute = () => {
        setMuted(!muted);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                setPlaying((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="relative h-screen flex pt-[10px] pb-[10px]">
            <ReactPlayer
                url={reel.videoUrl}
                playing={playing}
                loop
                muted={muted}
                width="350px"
                height="100%"
                playsinline
                onClick={handleVideoClick}
                style={{ pointerEvents: "auto" }}
            />

            <button
                onClick={toggleMute}
                className="absolute right-5 top-5 z-20 text-white text-2xl"
            >
                {muted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <div className="flex items-end justify-between w-[350px] absolute bottom-0 px-[18px] pb-[20px]">
                <div className="text-white">
                    <UserDetails
                        username={reel.username}
                        description={reel.description}
                        profilePic={reel.profilePic}
                    />
                </div>

                <div className="text-white flex flex-col items-center space-y-6">
                    <VideoActions reel={reel} />
                </div>
            </div>
        </div>
    );
};

const UserDetails = ({ username, description, profilePic }) => {
    return (
        <div className="flex items-center space-x-4">
            <img
                src={profilePic}
                alt={username}
                className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
                <p className="font-bold">{username}</p>
                <p className="text-sm">{description}</p>
            </div>
        </div>
    );
};

const VideoActions = ({ reel }) => {
    const [liked, setLiked] = useState(false);

    const handleLike = () => setLiked(!liked);

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center">
                <button onClick={handleLike} className="focus:outline-none">
                    <FaHeart className={`w-8 h-8 ${liked ? "text-red-500" : "text-white"}`} />
                </button>
                <p>{reel.likes}</p>
            </div>

            <div className="flex flex-col items-center">
                <FaComment className="w-8 h-8 text-white" />
                <p>{reel.comments}</p>
            </div>

            <div className="flex flex-col items-center">
                <FaSave className="w-8 h-8 text-white" />
            </div>

            <div className="flex flex-col items-center">
                <FaShare className="w-8 h-8 text-white" />
            </div>
        </div>
    );
};

export default ReelsPage;
