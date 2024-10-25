"use client";
import { useState } from 'react';
import ArneBrimiProfile from './PersonaProfile';

export const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Functions to open and close the sidebar
  const handleMouseEnter = () => {
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 min-h-full shadow-lg transition-transform duration-500 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-[95%]'
        }`}
        // Add hover event handlers
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Scrollable ArneBrimiProfile content */}
        <div className="overflow-y-auto h-[100vh]"> 
          <ArneBrimiProfile />
        </div>
      </div>
    </div>
  );
};