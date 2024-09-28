import React, { useState } from "react";

function ExplorePage() {
  const [activeTab, setActiveTab] = useState('For you');

  // Fake data for different tabs
  const data = {
    'For you': [
      { id: 1, src: '/src/assets/images/users-imgs/explore1.jpg', likes: '15k', comments: '2k', isReel: false, isMultiple: false },
      { id: 2, src: '/src/assets/images/users-imgs/explore2.jpg', likes: '5k', comments: '1k', isReel: false, isMultiple: true },
      { id: 3, src: '/src/assets/images/users-imgs/explore3.jpg', likes: '20k', comments: '3k', isReel: true, isMultiple: false },
      { id: 4, src: '/src/assets/images/users-imgs/explore4.jpg', likes: '12k', comments: '1k', isReel: false, isMultiple: false },
      { id: 5, src: '/src/assets/images/users-imgs/explore5.jpg', likes: '30k', comments: '5k', isReel: false, isMultiple: false },
      { id: 6, src: '/src/assets/images/users-imgs/explore6.jpg', likes: '8k', comments: '900', isReel: false, isMultiple: false },
      { id: 7, src: '/src/assets/images/users-imgs/explore7.jpg', likes: '4k', comments: '600', isReel: true, isMultiple: false },
      { id: 8, src: '/src/assets/images/users-imgs/explore8.jpg', likes: '25k', comments: '4k', isReel: false, isMultiple: false },
      { id: 9, src: '/src/assets/images/users-imgs/user13.jpg', likes: '18k', comments: '2.5k', isReel: false, isMultiple: false }
    ],
    'Trending': [
      { id: 5, src: '/src/assets/images/users-imgs/explore5.jpg', likes: '30k', comments: '5k', isReel: false, isMultiple: false },
      { id: 6, src: '/src/assets/images/users-imgs/explore6.jpg', likes: '8k', comments: '900', isReel: false, isMultiple: false },
      { id: 7, src: '/src/assets/images/users-imgs/explore7.jpg', likes: '4k', comments: '600', isReel: true, isMultiple: false },
    ],
    'Top': [
      { id: 8, src: '/src/assets/images/users-imgs/explore8.jpg', likes: '25k', comments: '4k', isReel: false, isMultiple: false },
      { id: 9, src: '/src/assets/images/users-imgs/user13.jpg', likes: '18k', comments: '2.5k', isReel: false, isMultiple: false },
    ],
    'Recent': [
      { id: 1, src: '/src/assets/images/users-imgs/explore1.jpg', likes: '15k', comments: '2k', isReel: false, isMultiple: false },
      { id: 2, src: '/src/assets/images/users-imgs/explore2.jpg', likes: '5k', comments: '1k', isReel: false, isMultiple: false },
    ],
    'Reels': [
      { id: 3, src: '/src/assets/images/users-imgs/explore3.jpg', likes: '20k', comments: '3k', isReel: true, isMultiple: false },
      { id: 7, src: '/src/assets/images/users-imgs/explore7.jpg', likes: '4k', comments: '600', isReel: true, isMultiple: false },
    ]
  };

  const cta = () => {
    return (
      <>
        <div className="flex items-center space-x-4 p-6 explore-cta">
          <div className="flex items-center bg-white rounded-full px-3 py-[0.6rem] shadow-sm w-[350px]">
            <i className="h-5 w-5 text-gray-400 dark:text-white search-icon"></i>
            <input
              type="text"
              placeholder="Search"
              className="ml-2 w-full bg-transparent outline-none text-gray-700 dark:text-white placeholder-gray-400"
            />
          </div>

          <div className="flex space-x-6 explore-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm ${activeTab === tab ? 'text-blue-600 underline font-bold dark:text-white' : 'text-gray-500 font-medium dark:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </>
    )
  };

  const tabs = ['For you', 'Trending', 'Top', 'Recent', 'Reels'];

  return (
    <div className="explore h-full">
      <div className="flex items-center pt-4 pb-8 pl-32 h-full">
        <div className="bg-[#EFEFEF] dark:bg-[#ffffff1c] h-full shadow-lg rounded-3xl flex overflow-hidden w-full mr-10 flex-col">
          <div>{cta()}</div>
          <div className="h-full overflow-auto thin-scrollable p-6">
            <div className="container mx-auto">
              <div className="grid-res grid grid-cols-4 gap-4">
                {data[activeTab].map((image) => (
                  <div key={image.id} className={`relative cursor-pointer group`}>
                    <img src={image.src} alt={`Image ${image.id}`} className="w-full h-full object-cover rounded-lg" />
                    {image.isReel && (
                      <div className="absolute top-2 right-2 text-white">
                        <i className="h-6 w-6 icon-reel-white"></i>
                      </div>
                    )}
                    {image.isMultiple && (
                      <div className="absolute top-2 right-2 text-white">
                        <i className="h-6 w-6 icon-multiple-white"></i>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black rounded-lg bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300">
                      <div className="text-white text-lg flex space-x-4">
                        <div className="flex items-center space-x-1">
                          <i class="far fa-heart"></i>
                          <span>{image.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i class="icon-comment"></i>
                          <span>{image.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;
