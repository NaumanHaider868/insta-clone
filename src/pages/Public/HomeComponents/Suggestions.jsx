import React from "react";
import "../../../assets/css/style.scss";

// Import images with variable names matching file names
import user7 from "../../../assets/images/users-imgs/user7.png";
import user16 from "../../../assets/images/users-imgs/user16.jpeg";
import user17 from "../../../assets/images/users-imgs/user17.jpeg";
import user18 from "../../../assets/images/users-imgs/user18.jpeg";
import user5 from "../../../assets/images/users-imgs/user5.png";

// Suggestions array
const suggestions = [
  {
    id: 1,
    username: "zark-mosally",
    imgSrc: user7,
  },
  {
    id: 2,
    username: "haider_ali",
    imgSrc: user16,
  },
  {
    id: 3,
    username: "naumanh",
    imgSrc: user17,
  },
  {
    id: 4,
    username: "mosa",
    imgSrc: user18,
  },
  {
    id: 5,
    username: "aliya_nadeem",
    imgSrc: user5,
  },
];


const Suggestions = () => {
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
            <a href="/see-all" className="dark:!text-white">See All</a>
          </div>
          <div className="suggestions-list">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="suggestion-item">
                <img
                  src={suggestion.imgSrc}
                  alt={suggestion.username}
                  className="suggestion-avatar"
                />
                <span className="suggestion-username dark:!text-white">
                  {suggestion.username}
                </span>
                <a href="/follow" className="follow-link">
                  Follow
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Suggestions;
