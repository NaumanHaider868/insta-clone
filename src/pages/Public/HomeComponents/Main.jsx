import React from "react";
import post from "../../../assets/images/post.jpg";
import mainUser from "../../../assets/images/users-imgs/user6.jpg";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import StoryRow from "./Story";
import Suggestions from "./Suggestions";
const Post = () => {
  return (
    <div className="content w-full h-full pt-5">
      <div className="flex">
        <div className="1 w-full h-full pl-32 flex ">
          <div className="w-full">
            <div className="story-content pb-5 w-[75%]">
              <StoryRow />
            </div>
            <div className="flex">
              <div className="main-home pt-4 w-[75%] h-full">
                <div className="posts mb-4">
                  <div className="bg-[#EFEFEF] rounded-[25px]">
                    <div className="rounded-3xl flex overflow-hidden max-w-4xl p-[14px]">
                      <div className="w-2/3 relative">
                        <img
                          src={post}
                          alt="Post"
                          className="object-cover w-full h-full rounded-[30px]"
                        />
                        <div className="post-more">
                          <i className="post-more-icon"></i>
                        </div>
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer w-[40px] h-[40px] rounded-full bg-[#D1D2D0] flex items-center justify-center">
                          <button className="arrow-left-white">
                            {/* &#8249; */}
                          </button>
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer w-[40px] h-[40px] rounded-full bg-[#D1D2D0] flex items-center justify-center">
                          <button className="arrow-right-white">
                            {/* &#8250; */}
                          </button>
                        </div>
                      </div>

                      {/* Right Side - Post Content */}
                      <div className="w-1/3 p-5">
                        {/* User Info */}
                        <div className="flex items-center mb-4">
                          <div className="avatar-post-div w-10 h-10 rounded-full mr-3">
                            <img
                              src={post}
                              alt="Avatar"
                              className="p-[2px] rounded-full cursor-pointer"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-sm cursor-pointer">
                              martin_tips
                            </p>
                            <p className="text-xs text-gray-500">57 minutes ago</p>
                          </div>
                          <button className="ml-auto text-gray-500">
                            &#x2022;&#x2022;&#x2022;
                          </button>
                        </div>

                        {/* Post Text */}
                        <p className="text-sm mb-4">
                          Вчера с друзьями мы затронули серьёзную тему и я только
                          сейчас поняла - многие аспекты моего восприятия родителя
                          были сформированы...{" "}
                          <span className="text-gray-500 cursor-pointer">
                            read more
                          </span>
                        </p>

                        {/* Likes and Icons */}
                        <div className="flex mb-4 flex-col">
                          <div className="action-div w-[188px] h-[46px] bg-[#F8F8F8] rounded-full flex items-center justify-center">
                            <button className="mr-3 w-[20px] h-[20px]">
                              <i className="post-like"></i>
                            </button>
                            <button className="mr-3 w-[20px] h-[20px]">
                              <i className="post-commant"></i>
                            </button>
                            <button className="mr-3 w-[20px] h-[20px]">
                              <i className="post-share"></i>
                            </button>
                            <button className="mr-3 w-[20px] h-[20px]">
                              <i className="post-save"></i>
                            </button>
                          </div>
                          <p className="text-[#000000] text-base ml-3 mt-2">
                            32.8k likes
                          </p>
                        </div>

                        {/* Comment Section */}
                        <div className="text-sm">
                          <div className="flex items-start mb-3">
                            <img
                              src={mainUser}
                              alt="Avatar"
                              className="w-8 h-8 rounded-full mr-3 cursor-pointer"
                            />
                            <div>
                              <p>
                                <span className="font-bold cursor-pointer">
                                  amanxux
                                </span>{" "}
                                Это тестовое сообщениеЭто тестовое сообщениеЭто
                                тестовое сообщениеЭто тестовое сообщениеЭто ...{" "}
                                <span className="text-gray-500 cursor-pointer">
                                  read more
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                37m ago{"\u00A0"}
                                {"\u00A0"}25 likes{"\u00A0"}
                                {"\u00A0"}Reply
                              </p>
                              <p className="text-gray-500 mt-2 flex items-center cursor-pointer">
                                _______{" "}
                                <span className="mt-[9px] ml-[10px]">
                                  View Replies(12)
                                </span>
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-4 cursor-pointer">
                            View all 1988 comments
                          </p>
                        </div>

                        {/* Scroll for More Comments */}
                        <div className="text-center show-all-comments">
                          <p className="text-xs text-gray-500">
                            Scroll down to read others comments
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#EFEFEF] rounded-[25px] mt-4">
                    <div className="rounded-3xl flex overflow-hidden max-w-4xl p-[14px]">
                      <div className="w-2/3 relative">
                        <img
                          src={post}
                          alt="Post"
                          className="object-cover w-full h-full rounded-[30px]"
                        />
                        <div className="post-more">
                          <i className="post-more-icon"></i>
                        </div>
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer w-[40px] h-[40px] rounded-full bg-[#D1D2D0] flex items-center justify-center">
                          <button className="arrow-left-white">
                            {/* &#8249; */}
                          </button>
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer w-[40px] h-[40px] rounded-full bg-[#D1D2D0] flex items-center justify-center">
                          <button className="arrow-right-white">
                            {/* &#8250; */}
                          </button>
                        </div>
                      </div>

                      {/* Right Side - Post Content */}
                      <div className="w-1/3 p-5">
                        {/* User Info */}
                        <div className="flex items-center mb-4">
                          <div className="avatar-post-div w-10 h-10 rounded-full mr-3">
                            <img
                              src={post}
                              alt="Avatar"
                              className="p-[2px] rounded-full cursor-pointer"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-sm cursor-pointer">
                              martin_tips
                            </p>
                            <p className="text-xs text-gray-500">57 minutes ago</p>
                          </div>
                          <button className="ml-auto text-gray-500">
                            &#x2022;&#x2022;&#x2022;
                          </button>
                        </div>

                        {/* Post Text */}
                        <p className="text-sm mb-4">
                          Вчера с друзьями мы затронули серьёзную тему и я только
                          сейчас поняла - многие аспекты моего восприятия родителя
                          были сформированы...{" "}
                          <span className="text-gray-500 cursor-pointer">
                            read more
                          </span>
                        </p>

                        {/* Likes and Icons */}
                        <div className="flex mb-4 flex-col">
                          <div className="action-div w-[188px] h-[46px] bg-[#F8F8F8] rounded-full flex items-center justify-center">
                            <button className="mr-3 w-[20px] h-[20px]">
                              <i className="post-like"></i>
                            </button>
                            <button className="mr-3 w-[20px] h-[20px]">
                              <i className="post-commant"></i>
                            </button>
                            <button className="mr-3 w-[20px] h-[20px]">
                              <i className="post-share"></i>
                            </button>
                            <button className="mr-3 w-[20px] h-[20px]">
                              <i className="post-save"></i>
                            </button>
                          </div>
                          <p className="text-[#000000] text-base ml-3 mt-2">
                            32.8k likes
                          </p>
                        </div>

                        {/* Comment Section */}
                        <div className="text-sm">
                          <div className="flex items-start mb-3">
                            <img
                              src={mainUser}
                              alt="Avatar"
                              className="w-8 h-8 rounded-full mr-3 cursor-pointer"
                            />
                            <div>
                              <p>
                                <span className="font-bold cursor-pointer">
                                  amanxux
                                </span>{" "}
                                Это тестовое сообщениеЭто тестовое сообщениеЭто
                                тестовое сообщениеЭто тестовое сообщениеЭто ...{" "}
                                <span className="text-gray-500 cursor-pointer">
                                  read more
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                37m ago{"\u00A0"}
                                {"\u00A0"}25 likes{"\u00A0"}
                                {"\u00A0"}Reply
                              </p>
                              <p className="text-gray-500 mt-2 flex items-center cursor-pointer">
                                _______{" "}
                                <span className="mt-[9px] ml-[10px]">
                                  View Replies(12)
                                </span>
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-4 cursor-pointer">
                            View all 1988 comments
                          </p>
                        </div>

                        {/* Scroll for More Comments */}
                        <div className="text-center show-all-comments">
                          <p className="text-xs text-gray-500">
                            Scroll down to read others comments
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[25%]">
                <Suggestions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
