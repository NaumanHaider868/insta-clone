import React, { useEffect, useRef, useState } from "react";
import "../../../assets/css/style.scss";

// Import images
import user6 from "../../../assets/images/users-imgs/user6.jpg";
import user19 from "../../../assets/images/users-imgs/user19.jpeg";
import user10 from "../../../assets/images/users-imgs/user10.jpeg";
import user12 from "../../../assets/images/users-imgs/user12.jpeg";
import user11 from "../../../assets/images/users-imgs/user11.jpeg";
import user14 from "../../../assets/images/users-imgs/user14.jpeg";
import user5 from "../../../assets/images/users-imgs/user5.jpeg";
import user13 from "../../../assets/images/users-imgs/user13.jpg";
import user9 from "../../../assets/images/users-imgs/user9.jpeg";

// Stories array
const stories = [
  { id: 1, imgSrc: user6, isUser: true },
  { id: 2, imgSrc: user19, isUser: false },
  { id: 3, imgSrc: user10, isUser: false },
  { id: 4, imgSrc: user12, isUser: false },
  { id: 5, imgSrc: user11, isUser: false },
  { id: 6, imgSrc: user14, isUser: false },
  { id: 7, imgSrc: user5, isUser: false },
  { id: 8, imgSrc: user13, isUser: false },
  { id: 9, imgSrc: user9, isUser: false },
  { id: 10, imgSrc: user9, isUser: false },
  { id: 11, imgSrc: user11, isUser: false },
  { id: 12, imgSrc: user14, isUser: false },
  { id: 13, imgSrc: user5, isUser: false },
  { id: 14, imgSrc: user13, isUser: false },
  { id: 15, imgSrc: user9, isUser: false },
  { id: 16, imgSrc: user9, isUser: false },
];
const userStory = stories.find((story) => story.isUser);
const otherStories = stories.filter((story) => !story.isUser);

const StoryRow = () => {
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(9);
  const containerRef = useRef(null);

  const calculateVisibleStories = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const storyWidth = 90;
      const storiesToShow = Math.floor(containerWidth / storyWidth);
      setVisibleCount(storiesToShow);
    }
  };

  useEffect(() => {
    calculateVisibleStories();
    window.addEventListener("resize", calculateVisibleStories);

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

      <div className="other-users flex w-full relative" ref={containerRef}>
        {currentIndex > 0 && (
          <div className="next-button top-[25px] z-10 left-[20px] absolute" onClick={handleBack}>
            <div className="circle">
              <i className="back-icon"></i>
            </div>
          </div>
        )}
        {visibleStories.map((story) => (
          <div key={story.id} className="story relative" onClick={() => setOpen(true)}>
            <div className="story-circle">
              <img src={story.imgSrc} alt={`story ${story.id}`} />
            </div>
          </div>
        ))}
        {/* {open && (
          <StoryCarousel />
        )} */}
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
