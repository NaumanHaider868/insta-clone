import React from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Search and Tabs */}
      <div className="p-4 bg-white shadow">
        <div className="flex items-center justify-between">
          {/* Search bar */}
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex space-x-6 text-gray-600">
            <button className="font-semibold text-blue-600">For you</button>
            <button>Trending</button>
            <button>Top</button>
            <button>Recent</button>
            <button>Reels</button>
          </div>
        </div>
      </div>

      {/* Image grid */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Images */}
          {Array(9)
            .fill("")
            .map((_, index) => (
              <div key={index} className="relative w-full h-64 bg-gray-200">
                {/* Placeholder for images, you can replace with actual image URLs */}
                <img
                  src={`https://via.placeholder.com/300?text=Image+${
                    index + 1
                  }`}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />

                {/* Overlay (optional, for icons like heart or view count) */}
                {index === 1 && (
                  <div className="absolute inset-0 flex justify-center items-center">
                    <span className="text-white text-xl">❤️ 15k</span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;
