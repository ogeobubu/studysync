import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden transition-opacity
          ${sidebarOpen ? 'block' : 'hidden'}
        `}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-white transform transition-transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:sticky md:translate-x-0 md:block
        `}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen bg-white">
        {/* Mobile topbar with menu toggle */}
        <div className="md:hidden p-4 bg-white shadow flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-4 text-lg font-semibold">Dashboard</span>
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
