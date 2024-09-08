import React from 'react';

const GhostBids = () => {
  return (
    <div className="w-full  gap-2    grid sm:grid-cols-2  lg:grid-cols-3">
      {[1, 2, 3].map((m: any, i) => (
        <div
          key={i}
          className="px-6 shadow py-4 h-56 animate-pulse_fast bg-opacity-70  backdrop-filter[5px] flex flex-col justify-between  w-full cursor-pointer bg-white rounded-lg">
          <div className="w-2/3 bg-gray-300  rounded-lg h-6"></div>
          <div className="w-14 h-14 rounded-full bg-gray-300 "></div>
          <div className="w-2/3 bg-gray-300 rounded-lg h-6"></div>
        </div>
      ))}
    </div>
  );
};

export default GhostBids;
