"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <nav className="w-full border-b border-gray-200 bg-white/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 flex flex-wrap items-center justify-between">
        {/* Logo */}
        <h1 className="text-lg font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
            DeepScope
          </span>
        </h1>
        {/* Nav Links */}
        <div className="flex gap-2 sm:gap-4 md:gap-8 text-sm text-gray-600 flex-wrap items-center">
          <Link
            href="/"
            className={`${pathname === '/' ? 'text-black font-medium' : 'hover:text-black transition'}`}
          >
            Home
          </Link>
          <Link
            href="/projects"
            className={`${pathname === '/projects' ? 'text-black font-medium' : 'hover:text-black transition'}`}
          >
            Projects
          </Link>
          <Link href="#" className="hover:text-black transition">
            Publications
          </Link>
          <Link
            href="/team"
            className={`hover:text-black transition ${pathname === '/team' ? 'text-black font-medium' : ''}`}
          >
            Team
          </Link>
          <button
            className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 transition font-medium"
            onClick={() => setSidebarOpen(true)}
          >
            Login
          </button>
        </div>
      </div>
      {/* Sidebar overlay and menu */}
      {sidebarOpen && (
        <>
          {/* Classic Sidebar (panel) */}
          <div
            className="fixed inset-0 z-40"
            style={{ pointerEvents: 'none' }}
          />
          <aside
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col p-6 transition-all duration-300 border-l border-gray-200"
            style={{ pointerEvents: 'auto', width: 'min(90vw, 22rem)', height: '100vh' }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-semibold text-gray-800">Login</span>
              <button
                className="text-gray-400 hover:text-gray-700 text-xl font-semibold"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-2 mb-4">
                <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700 text-sm font-normal whitespace-normal break-words">Login as Registered Member</a>
                <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700 text-sm font-normal whitespace-normal break-words">Login as Instructor</a>
                <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700 text-sm font-normal whitespace-normal break-words">Login as Core Member</a>
                <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700 text-sm font-normal whitespace-normal break-words">Login as Admin</a>
              </div>
              <hr className="my-3 border-gray-200" />
              <div className="mt-3 text-gray-600 text-center text-sm">
                <div className="mb-1">Not registered yet?</div>
                <a href="#" className="inline-block px-3 py-2 mt-1 rounded bg-gray-900 text-white hover:bg-gray-800 transition font-normal text-sm">Registration</a>
              </div>
            </div>
          </aside>
          {/* Click outside to close */}
          <div
            className="fixed inset-0 z-30"
            style={{ background: 'transparent' }}
            onClick={() => setSidebarOpen(false)}
          />
        </>
      )}
    </nav>
  );
}