import React from "react";
import post from "../../../assets/images/users-imgs/virat2.jpg";
import post1 from "../../../assets/images/users-imgs/user7.png";
import mainUser from "../../../assets/images/users-imgs/user7.png";
import StoryRow from "./Story";
import Suggestions from "./Suggestions";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Pagination, Navigation } from "swiper/modules";

const Post = () => {
  const postData = [
    {
      id: 1,
      user: {
        username: "martin_tips",
        avatar: post,
        postedTime: "57 minutes ago",
      },
      content: {
        images: [post, post1], // Multiple images for this post
        text: "Вчера с друзьями мы затронули серьёзную тему...",
        likes: 32800,
        comments: 1988,
        mainUserComment: {
          username: "amanxux",
          text: "Это тестовое сообщение...",
          timeAgo: "37m ago",
          likes: 25,
          replies: 12,
        },
      },
    },
    {
      id: 2,
      user: {
        username: "martin_tips",
        avatar: post1,
        postedTime: "57 minutes ago",
      },
      content: {
        images: [post1], // Only one image for this post
        text: "Вчера с друзьями мы затронули серьёзную тему...",
        likes: 32800,
        comments: 1988,
        mainUserComment: {
          username: "amanxux",
          text: "Это тестовое сообщение...",
          timeAgo: "37m ago",
          likes: 25,
          replies: 12,
        },
      },
    },
  ];

  return (
    <div className="content w-full h-full pt-5">
      <div className="flex">
        <div className="1 w-full h-full flex main-content">
          <div className="w-full main-content-w">
            <div className="story-content pb-5 w-[75%]">
              <StoryRow />
            </div>
            <div className="flex main-home">
              <div className="pt-4 content w-[75%] h-full">
                {postData.map((post) => (
                  <div key={post.id} className="posts mb-4">
                    <div className="bg-[#EFEFEF] rounded-[25px] dark:bg-[#ffffff1c] post">
                      <div className="rounded-3xl flex overflow-hidden max-w-[57rem] p-[14px] dark:text-white">
                        <div className="w-[56%] relative post-content">
                          {post.content.images.length > 1 ? (
                            <Swiper
                              modules={[Keyboard, Pagination, Navigation]}
                              navigation
                              pagination={{ clickable: true }}
                              keyboard={{ enabled: true }}
                              className="w-full h-full"
                            >
                              {post.content.images.map((image, index) => (
                                <SwiperSlide key={index}>
                                  <img
                                    src={image}
                                    alt={`Post Slide ${index + 1}`}
                                    className="object-contain w-full h-full rounded-[30px]"
                                  />
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          ) : (
                            <img
                              src={post.content.images[0]}
                              alt="Post"
                              className="object-contain w-full h-full rounded-[30px]"
                            />
                          )}
                        </div>

                        <div className="w-[44%] p-5 pr-0 post-detail">
                          {/* Post Details */}
                          <div className="flex items-center mb-4">
                            <div className="avatar-post-div w-10 h-10 rounded-full mr-3">
                              <img
                                src={post.user.avatar}
                                alt="Avatar"
                                className="p-[2px] rounded-full cursor-pointer h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-sm cursor-pointer">
                                {post.user.username}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-white">
                                {post.user.postedTime}
                              </p>
                            </div>
                            <button className="ml-auto text-gray-500 dark:text-white font-bold text-[22px]">
                              &#8942;
                            </button>
                          </div>

                          <p className="text-sm mb-4">
                            {post.content.text}{" "}
                            <span className="text-gray-500 cursor-pointer dark:text-white">
                              read more
                            </span>
                          </p>

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
                            <p className="text-[#000000] text-base ml-3 mt-2 dark:text-white">
                              {post.content.likes.toLocaleString()} likes
                            </p>
                          </div>

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
                                    {post.content.mainUserComment.username}
                                  </span>{" "}
                                  {post.content.mainUserComment.text}{" "}
                                  <span className="text-gray-500 cursor-pointer dark:text-white">
                                    read more
                                  </span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1 dark:text-white">
                                  {post.content.mainUserComment.timeAgo}{"\u00A0"}
                                  {"\u00A0"}
                                  {post.content.mainUserComment.likes} likes{"\u00A0"}
                                  {"\u00A0"}Reply
                                </p>
                                <p className="text-gray-500 mt-2 flex items-center cursor-pointer dark:text-white">
                                  _______{" "}
                                  <span className="mt-[9px] ml-[10px]">
                                    View Replies({post.content.mainUserComment.replies})
                                  </span>
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-4 cursor-pointer dark:text-white">
                              View all {post.content.comments} comments
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="content-suggestion w-[25%]">
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
