"use client"
import React, { useState } from 'react';


export const Sidebar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  return (
    (isNavbarOpen?     <div className="h-screen w-1/4 bg-gray-800 fixed left-0 flex flex-col  z-10" onClick={() => setIsNavbarOpen(false)}>
    <div
      className={`absolute z-10 top-0 left-0 transform ${isNavbarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 h-full w-1/4 bg-gray-800 text-white`}
    >
    </div>
  </div> :    <div
  className="h-screen w-[1%] bg-gray-800 fixed left-0 flex flex-col z-10"
  onClick={() => setIsNavbarOpen(true)}
>
  <div
    className={`absolute z-10 top-0 left-0 transform ${isNavbarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 h-full w-[4%] bg-gray-800 text-white`}
  >
  </div>
</div>
)
  );
};
