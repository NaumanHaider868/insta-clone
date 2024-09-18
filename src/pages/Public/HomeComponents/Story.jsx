import React from "react";
import "../../../assets/css/style.scss";
import ArrowRight from "../../../assets/images/action-icons/arrow-right.svg";

const stories = [
  {
    id: 1,
    imgSrc: "/src/assets/images/users-imgs/user6.jpg",
    isUser: true,
  },
  { id: 2, imgSrc: "/src/assets/images/users-imgs/user19.jpeg", isUser: false },
  { id: 3, imgSrc: "/src/assets/images/users-imgs/user10.jpeg", isUser: false },
  { id: 4, imgSrc: "/src/assets/images/users-imgs/user12.jpeg", isUser: false },
  { id: 5, imgSrc: "/src/assets/images/users-imgs/user11.jpeg", isUser: false },
  { id: 6, imgSrc: "/src/assets/images/users-imgs/user14.jpeg", isUser: false },
  { id: 7, imgSrc: "/src/assets/images/users-imgs/user5.jpeg", isUser: false },
  { id: 8, imgSrc: "/src/assets/images/users-imgs/user13.jpg", isUser: false },
  { id: 9, imgSrc: "/src/assets/images/users-imgs/user9.jpeg", isUser: false },
];

const StoryRow = () => {
  return (
    <div className="story-row">
      {stories.map((story) => (
        <div key={story.id} className="story relative">
          <div className={story.isUser ? "new-story" : "story-circle"}>
            <img src={story.imgSrc} alt={`story ${story.id}`} />
            {story.isUser && (
              <div className="add-story absolute w-[25px] h-[25px] bg-[#0095F6] rounded-full bottom-[-4px] right-[3px]">
                <i className="plus-icon"></i>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="next-button">
        <div className="circle">
          <i className="next-icon"></i>
        </div>
      </div>
    </div>
  );
};

export default StoryRow;
