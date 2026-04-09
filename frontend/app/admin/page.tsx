"use client";
import { useState, useEffect } from "react";
import type React from "react";
import Link from "next/link";
import { FaUsers, FaHome, FaProjectDiagram, FaBookOpen, FaUserTie } from "react-icons/fa";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // On mount, check for token
    if (typeof window !== 'undefined' && localStorage.getItem('adminToken')) {
      setLoggedIn(true);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminId, password: adminPass })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        setLoggedIn(true);
        setError("");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      {!loggedIn ? (
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded p-8 w-full max-w-sm flex flex-col gap-4"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Admin Login</h2>
          <input
            type="text"
            placeholder="Admin ID"
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            style={{ color: '#111' }}
            value={adminId}
            onChange={e => setAdminId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            style={{ color: '#111' }}
            value={adminPass}
            onChange={e => setAdminPass(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <button
            type="submit"
            className="bg-gray-900 text-white rounded px-4 py-2 mt-2 hover:bg-gray-800 transition text-sm font-medium"
          >
            Login
          </button>
        </form>
      ) : (
        <div className="w-full max-w-3xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Admin Dashboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AdminCard title="Manage Team" href="/admin/team" />
            <AdminCard title="Home Page Manager" href="/admin/home" />
            <AdminCard title="Project Manager" href="/admin/projects" />
            <AdminCard title="Publication Manager" href="/admin/publications" />
            <AdminCard title="Team Member Manager" href="/admin/team-members" />
          </div>
        </div>
      )}
    </div>
  );
}

const cardIcons: Record<string, React.ReactNode> = {
  "Manage Team": <FaUsers className="text-3xl text-blue-500 mb-2" />,
  "Home Page Manager": <FaHome className="text-3xl text-green-500 mb-2" />,
  "Project Manager": <FaProjectDiagram className="text-3xl text-purple-500 mb-2" />,
  "Publication Manager": <FaBookOpen className="text-3xl text-pink-500 mb-2" />,
  "Team Member Manager": <FaUserTie className="text-3xl text-yellow-500 mb-2" />,
};

function AdminCard({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="backdrop-blur-lg bg-white/30 border border-white/40 rounded-xl shadow-lg p-7 flex flex-col items-center justify-center min-h-[140px] hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer no-underline group"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
    >
      {cardIcons[title]}
      <span className="text-lg font-semibold text-gray-800 text-center group-hover:text-blue-700 tracking-tight drop-shadow-sm transition-all duration-200">
        {title}
      </span>
    </Link>
  );
}
