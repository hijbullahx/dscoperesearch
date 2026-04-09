"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  username?: string;
};

type PendingRegistration = {
  id: number;
  name: string;
  email: string;
  requested_role: string;
  bio?: string;
};

const TeamAdminPage = () => {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('adminToken')) {
      router.replace('/admin');
      return;
    }
    fetch('http://127.0.0.1:8000/api/teammembers/')
      .then(res => res.json())
      .then(data => {
        setTeamMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    setPendingRegistrations([
      { id: 1, name: 'Alice Pending', email: 'alice@example.com', requested_role: 'General Member', bio: 'Interested in research.' },
      { id: 2, name: 'Bob Pending', email: 'bob@example.com', requested_role: 'Instructor', bio: '' },
    ]);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">Manage Team</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => setShowAdd(true)}
          >
            <FaPlus /> Add Member
          </button>
        </div>

        {/* Team Members List */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Current Members</h2>
          {loading ? (
            <div className="text-gray-500 text-center py-8">Loading team members...</div>
          ) : teamMembers.length === 0 ? (
            <div className="bg-gray-50 border rounded-lg p-8 text-gray-600 text-center">
              No team members found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center gap-4 bg-white/60 backdrop-blur rounded-xl border border-gray-200 p-4 shadow hover:shadow-lg transition">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-14 h-14 rounded-full object-cover border" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold border text-xl">
                      {member.name[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-lg">{member.name}</div>
                    <div className="text-sm text-blue-700 font-medium">{member.role}</div>
                    {member.bio && <div className="text-xs text-gray-500 mt-1">{member.bio}</div>}
                  </div>
                  <button className="p-2 text-blue-500 hover:text-blue-700" title="Edit"><FaEdit /></button>
                  <button className="p-2 text-red-500 hover:text-red-700" title="Remove"><FaTrash /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Registrations */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Registrations</h2>
          {pendingRegistrations.length === 0 ? (
            <div className="bg-gray-50 border rounded-lg p-8 text-gray-600 text-center">
              No pending registrations.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pendingRegistrations.map(reg => (
                <div key={reg.id} className="flex items-center gap-4 bg-white/60 backdrop-blur rounded-xl border border-gray-200 p-4 shadow">
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold border text-xl">
                    {reg.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-lg">{reg.name}</div>
                    <div className="text-sm text-gray-700">{reg.email}</div>
                    <div className="text-xs text-blue-700 font-medium">{reg.requested_role}</div>
                    {reg.bio && <div className="text-xs text-gray-500 mt-1">{reg.bio}</div>}
                  </div>
                  <button className="p-2 text-green-600 hover:text-green-800" title="Accept"><FaCheck /></button>
                  <button className="p-2 text-red-500 hover:text-red-700" title="Decline"><FaTimes /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Member Modal (placeholder) */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowAdd(false)}>&times;</button>
              <h3 className="text-lg font-bold mb-4">Add New Member</h3>
              {/* Form fields for name, role, username, password, etc. */}
              <form className="flex flex-col gap-3">
                <input className="border rounded px-3 py-2 text-sm" placeholder="Name" />
                <input className="border rounded px-3 py-2 text-sm" placeholder="Username" />
                <input className="border rounded px-3 py-2 text-sm" placeholder="Password" type="password" />
                <select className="border rounded px-3 py-2 text-sm">
                  <option>General Member</option>
                  <option>Instructor</option>
                  <option>Core Member</option>
                </select>
                <textarea className="border rounded px-3 py-2 text-sm" placeholder="Bio (optional)" />
                <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 mt-2 hover:bg-blue-700 transition text-sm font-medium">Add Member</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamAdminPage;
