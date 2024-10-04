import React, { useEffect, useState } from 'react';
import user1 from '../../../assets/images/users-imgs/user6.jpg';

const data = {
    'Posts': [
        { id: 1, src: '/src/assets/images/users-imgs/explore1.jpg', likes: '15k', comments: '2k', isReel: false, isMultiple: false },
        { id: 2, src: '/src/assets/images/users-imgs/explore2.jpg', likes: '5k', comments: '1k', isReel: false, isMultiple: true },
        { id: 3, src: '/src/assets/images/users-imgs/explore3.jpg', likes: '20k', comments: '3k', isReel: true, isMultiple: false },
        { id: 4, src: '/src/assets/images/users-imgs/explore4.jpg', likes: '12k', comments: '1k', isReel: false, isMultiple: false },
    ],
    'Reels': [
        { id: 3, src: '/src/assets/images/users-imgs/explore3.jpg', likes: '20k', comments: '3k', isReel: true, isMultiple: false },
        { id: 7, src: '/src/assets/images/users-imgs/explore7.jpg', likes: '4k', comments: '600', isReel: true, isMultiple: false },
    ],
};

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('Posts');

    const filteredData = activeTab === 'Reels'
        ? data['Reels']
        : data['Posts'];

    let isDark;

    useEffect(() => {
        isDark = localStorage.getItem("dark-mode")
    }, [])

    const tabs = [
        {
            name: 'Posts',
            label: 'Posts',
            icon: (
                <svg width="18" height="18" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_201_521)">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18.6 2.06667H12.4V9.3H18.6V2.06667ZM10.3333 2.06667V9.3H2.06667V4.13333C2.06667 2.99195 2.99195 2.06667 4.13333 2.06667H10.3333ZM10.3333 11.3667H2.06667V18.6H10.3333V11.3667ZM10.3333 20.6667H2.06667V26.8667C2.06667 28.0081 2.99195 28.9333 4.13333 28.9333H10.3333V20.6667ZM0 20.6667V18.6V11.3667V9.3V4.13333C0 1.85056 1.85056 0 4.13333 0H10.3333H12.4H26.8667C29.1495 0 31 1.85056 31 4.13333V26.8667C31 29.1495 29.1495 31 26.8667 31H20.6667H18.6H4.13333C1.85056 31 0 29.1495 0 26.8667V20.6667ZM12.4 20.6667H18.6V28.9333H12.4V20.6667ZM18.6 18.6H12.4V11.3667H18.6V18.6ZM20.6667 20.6667V28.9333H26.8667C28.0081 28.9333 28.9333 28.0081 28.9333 26.8667V20.6667H20.6667ZM28.9333 18.6V11.3667H20.6667V18.6H28.9333ZM28.9333 4.13333V9.3H20.6667V2.06667H26.8667C28.0081 2.06667 28.9333 2.99195 28.9333 4.13333Z"
                            fill={activeTab === 'Posts' ? '#1E90FF' : '#8D8D8D'}
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_201_521">
                            <rect width="31" height="31" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            )
        },
        {
            name: 'Reels',
            label: 'Reels',
            icon: (
                <svg width="18" height="18" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1305 2.48132H10.011L13.23 7.27821L20.2398 7.18466L17.1305 2.48132ZM6.61686 2.48132H8.01885L11.2555 7.30456L2.48132 7.42167V6.61686C2.48132 4.33287 4.33287 2.48132 6.61686 2.48132ZM19.1135 2.48132L22.2054 7.15842L28.5187 7.07415V6.61686C28.5187 4.33287 26.6671 2.48132 24.3831 2.48132H19.1135ZM2.48132 24.3831V9.9032L28.5187 9.55573V24.3831C28.5187 26.6671 26.6671 28.5187 24.3831 28.5187H6.61686C4.33287 28.5187 2.48132 26.6671 2.48132 24.3831ZM6.61686 0C2.96247 0 0 2.96248 0 6.61686V24.3831C0 28.0375 2.96247 31 6.61686 31H24.3831C28.0375 31 31 28.0375 31 24.3831V6.61686C31 2.96247 28.0375 0 24.3831 0H6.61686ZM20.8982 19.6062C21.4445 19.2791 21.432 18.4834 20.8757 18.1737L13.5955 14.1218C13.0391 13.8121 12.3562 14.2209 12.3663 14.8575L12.4973 23.1883C12.5073 23.8249 13.2026 24.212 13.749 23.885L20.8982 19.6062Z" fill={activeTab === 'Reels' ? '#1E90FF' : '#8D8D8D'} />
                </svg>
            )
        },
        {
            name: 'Saved',
            icon: (
                <svg width="18" height="18" viewBox="0 0 26 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M25 28.2398C25 29.8419 23.2105 30.7937 21.8821 29.8982L14.1179 24.6645C13.4422 24.209 12.5578 24.209 11.8821 24.6645L4.11791 29.8982C2.78951 30.7937 1 29.8419 1 28.2398V3C1 1.89543 1.89543 1 3 1H23C24.1046 1 25 1.89543 25 3V28.2398Z"
                        stroke={activeTab === 'Saved' ? '#1E90FF' : '#8D8D8D'} // Blue when active, gray otherwise
                        strokeWidth="2"
                        strokeMiterlimit="10"
                    />
                </svg>
            )
        }
    ];

    return (
        <div className="profile h-full">
            <div className="flex items-center pt-4 pb-8">
                <div className="bg-[#EFEFEF] dark:bg-[#ffffff1c] h-full shadow-lg rounded-3xl flex overflow-hidden w-full flex-col">
                    <div className="flex flex-col items-center main-profile">
                        <div className="flex w-full gap-6 items-start p-6 user-profile">
                            <div className="w-[195px] rounded-full overflow-hidden mb-4 bg-story user-profile-img">
                                <img
                                    src={user1}
                                    alt="Profile"
                                    className="w-full h-full object-cover cursor-pointer p-[2px] rounded-[50%]"
                                />
                            </div>

                            <div className="flex flex-col user-profile-deatil">
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Nauman Haider</h1>
                                <p className="text-sm text-gray-500 dark:text-white mt-[5px] mb-[5px]">@naumanh</p>

                                <div className="flex space-x-4 mt-[10px] mb-[10px]">
                                    <div className="text-center flex items-center gap-[6px] cursor-pointer">
                                        <span className="font-bold text-[14px] dark:text-white">225</span>
                                        <p className="text-sm text-gray-500 dark:text-white">Posts</p>
                                    </div>
                                    <div className="text-center flex items-center gap-[6px] cursor-pointer">
                                        <span className="font-bold text-[14px] dark:text-white">225</span>
                                        <p className="text-sm text-gray-500 dark:text-white">Followers</p>
                                    </div>
                                    <div className="text-center flex items-center gap-[6px] cursor-pointer">
                                        <span className="font-bold text-[14px] dark:text-white">225</span>
                                        <p className="text-sm text-gray-500 dark:text-white">Following</p>
                                    </div>
                                </div>

                                <p className='dark:text-white'>
                                    <span className="font-bold dark:text-white">Bio</span>: It always seems impossible until it is done. 💖 Nature lover: 🌿⛰️🌸 Web Developer 💻
                                </p>

                                <a
                                    href="https://www.linkedin.com/in/nauman-haider-107002295/"
                                    className="text-blue-500 mt-4 underline"
                                >
                                    https://www.linkedin.com/in/nauman-haider-107002295/
                                </a>

                                <button className="edit-btn mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-[50px] font-medium text-gray-700">
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="p-6 w-full flex flex-col items-center">
                            <div className="flex space-x-6 ml-[8rem] profile-tabs">
                                {tabs.map(({ name, icon }) => (
                                    <button
                                        onClick={() => setActiveTab(name)}
                                        className={`flex items-center space-x-2 text-sm ${activeTab === name ? 'text-blue-600 dark:text-white underline font-bold' : 'text-gray-500 dark:text-white font-medium'}`}
                                    >
                                        {icon}
                                        <span>{name}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="container mx-auto mt-6">
                                <div className="grid-profile grid grid-cols-4 gap-4">
                                    {filteredData.map((image) => (
                                        <div key={image.id} className="relative group">
                                            <img
                                                src={image.src}
                                                alt="Post"
                                                className="w-full h-full object-cover rounded-lg group-hover:opacity-80 transition duration-300"
                                            />
                                            {image.isMultiple && (
                                                <div className="absolute top-2 right-2 text-white">
                                                    <i className="h-6 w-6 icon-multiple-white"></i>
                                                </div>
                                            )}
                                            {image.isReel && (
                                                <div className="absolute top-2 right-2 text-white">
                                                    <i className="h-6 w-6 icon-reel-white"></i>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300 rounded-lg">
                                                <div className="text-white text-lg flex space-x-4">
                                                    <div className="flex items-center space-x-1">
                                                        <i className="far fa-heart"></i>
                                                        <span>{image.likes}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <i className="icon-comment"></i>
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
        </div>
    );
};

export default UserProfile;
