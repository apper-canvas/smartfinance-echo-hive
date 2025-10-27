import React from "react";

const Loading = ({ type = "cards" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-card p-6 shadow-card">
            <div className="animate-shimmer h-4 w-20 mb-2 rounded"></div>
            <div className="animate-shimmer h-8 w-32 mb-1 rounded"></div>
            <div className="animate-shimmer h-3 w-16 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-6">
          <div className="animate-shimmer h-6 w-40 mb-4 rounded"></div>
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className="animate-shimmer w-10 h-10 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="animate-shimmer h-4 w-32 rounded"></div>
                    <div className="animate-shimmer h-3 w-24 rounded"></div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="animate-shimmer h-4 w-20 rounded"></div>
                  <div className="animate-shimmer h-3 w-16 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="bg-white rounded-card shadow-card p-6">
        <div className="animate-shimmer h-6 w-40 mb-6 rounded"></div>
        <div className="animate-shimmer h-64 w-full rounded"></div>
      </div>
    );
  }

  // Default skeleton
  return (
    <div className="space-y-6">
      <div className="animate-shimmer h-8 w-64 rounded"></div>
      <div className="space-y-3">
        <div className="animate-shimmer h-4 w-full rounded"></div>
        <div className="animate-shimmer h-4 w-5/6 rounded"></div>
        <div className="animate-shimmer h-4 w-4/6 rounded"></div>
      </div>
    </div>
  );
};

export default Loading;