import React, { useState, useEffect, useRef } from "react";
import "../../../assets/css/style.scss";

const stories = [
  { id: 1, imgSrc: "/src/assets/images/users-imgs/user6.jpg", isUser: true },
  { id: 2, imgSrc: "/src/assets/images/users-imgs/user19.jpeg", isUser: false },
  { id: 3, imgSrc: "/src/assets/images/users-imgs/user10.jpeg", isUser: false },
  { id: 4, imgSrc: "/src/assets/images/users-imgs/user12.jpeg", isUser: false },
  { id: 5, imgSrc: "/src/assets/images/users-imgs/user11.jpeg", isUser: false },
  { id: 6, imgSrc: "/src/assets/images/users-imgs/user14.jpeg", isUser: false },
  { id: 7, imgSrc: "/src/assets/images/users-imgs/user5.jpeg", isUser: false },
  { id: 8, imgSrc: "/src/assets/images/users-imgs/user13.jpg", isUser: false },
  { id: 9, imgSrc: "/src/assets/images/users-imgs/user9.jpeg", isUser: false },
  { id: 10, imgSrc: "/src/assets/images/users-imgs/user9.jpeg", isUser: false },
  { id: 11, imgSrc: "/src/assets/images/users-imgs/user11.jpeg", isUser: false },
  { id: 12, imgSrc: "/src/assets/images/users-imgs/user14.jpeg", isUser: false },
  { id: 13, imgSrc: "/src/assets/images/users-imgs/user5.jpeg", isUser: false },
  { id: 14, imgSrc: "/src/assets/images/users-imgs/user13.jpg", isUser: false },
  { id: 15, imgSrc: "/src/assets/images/users-imgs/user9.jpeg", isUser: false },
  { id: 16, imgSrc: "/src/assets/images/users-imgs/user9.jpeg", isUser: false },
];

const userStory = stories.find((story) => story.isUser);
const otherStories = stories.filter((story) => !story.isUser);

const StoryRow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(9); // Default to 9 stories on small screens
  const containerRef = useRef(null);

  // Function to calculate how many stories fit based on the container's width
  const calculateVisibleStories = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const storyWidth = 90; // Assuming each story box is 90px wide
      const storiesToShow = Math.floor(containerWidth / storyWidth);
      setVisibleCount(storiesToShow);
    }
  };

  // Run this calculation when the window resizes
  useEffect(() => {
    calculateVisibleStories();
    window.addEventListener("resize", calculateVisibleStories);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("resize", calculateVisibleStories);
    };
  }, []);

  const visibleStories = otherStories.slice(currentIndex, currentIndex + visibleCount);

  const handleNext = () => {
    if (currentIndex + visibleCount < otherStories.length) {
      setCurrentIndex((prevIndex) => prevIndex + 5);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 5);
    }
  };

  return (
    <div className="story-row">
      <div className="story-me">
        {userStory && (
          <div className="story relative">
            <div className="new-story">
              <img src={userStory.imgSrc} alt="Your story" />
              <div className="add-story absolute w-[25px] h-[25px] bg-[#0095F6] rounded-full bottom-[-4px] right-[3px]">
                <i className="plus-icon"></i>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Other users' stories */}
      <div className="other-users flex w-full relative" ref={containerRef}>
        {currentIndex > 0 && (
          <div className="next-button top-[25px] z-10 left-[20px] absolute" onClick={handleBack}>
            <div className="circle">
              <i className="back-icon"></i>
            </div>
          </div>
        )}
        {visibleStories.map((story) => (
          <div key={story.id} className="story relative">
            <div className="story-circle">
              <img src={story.imgSrc} alt={`story ${story.id}`} />
            </div>
          </div>
        ))}
        {currentIndex + visibleCount < otherStories.length && (
          <div className="next-button absolute right-[43px] top-[25px]" onClick={handleNext}>
            <div className="circle">
              <i className="next-icon"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryRow;
