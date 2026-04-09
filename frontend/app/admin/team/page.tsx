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
  google_scholar?: string;
  github?: string;
  linkedin?: string;
  website?: string;
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
  const [showEdit, setShowEdit] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({ name: '', username: '', password: '', role: 'General Member', bio: '', google_scholar: '', github: '', linkedin: '', website: '' });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const fetchTeamMembers = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/teammembers/')
      .then(res => res.json())
      .then(data => {
        setTeamMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchPendingRegistrations = () => {
    // This is mocked for now. Replace with your actual API call.
    setPendingRegistrations([
      { id: 1, name: 'Alice Pending', email: 'alice@example.com', requested_role: 'General Member', bio: 'Interested in research.' },
      { id: 2, name: 'Bob Pending', email: 'bob@example.com', requested_role: 'Instructor', bio: '' },
    ]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('adminToken')) {
      router.replace('/admin');
      return;
    }
    fetchTeamMembers();
    fetchPendingRegistrations();
  }, [router]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const formData = new FormData();
    formData.append('name', newMember.name);
    formData.append('username', newMember.username);
    formData.append('password', newMember.password);
    formData.append('role', newMember.role);
    formData.append('bio', newMember.bio);
    formData.append('google_scholar', newMember.google_scholar);
    formData.append('github', newMember.github);
    formData.append('linkedin', newMember.linkedin);
    formData.append('website', newMember.website);
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/teammembers/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setShowAdd(false);
        setNewMember({ name: '', username: '', password: '', role: 'General Member', bio: '', google_scholar: '', github: '', linkedin: '', website: '' });
        setPhotoFile(null);
        fetchTeamMembers(); // Re-fetch members to show the new one
      } else {
        // Handle error
        console.error('Failed to add member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    // This is a placeholder for your update logic.
    // You would typically send a PUT or PATCH request to your backend.
    console.log('Updating member:', editingMember);
    
    // Example of what the API call might look like:
    /*
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/teammembers/${editingMember.id}/`, {
        method: 'PUT', // or 'PATCH'
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingMember),
      });

      if (res.ok) {
        setShowEdit(false);
        setEditingMember(null);
        fetchTeamMembers(); // Refresh the list
      } else {
        console.error('Failed to update member');
      }
    } catch (error) {
      console.error('Error updating member:', error);
    }
    */
    
    // For now, just update the local state for demonstration
    setTeamMembers(prev => prev.map(m => m.id === editingMember.id ? editingMember : m));
    setShowEdit(false);
    setEditingMember(null);
  };

  const handleDeleteMember = async (memberId: number) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/teammembers/${memberId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (res.ok) {
        fetchTeamMembers(); // Refresh the list
      } else {
        console.error('Failed to delete member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleApprove = async (registration: PendingRegistration) => {
    // STEP 1: Send a request to your backend to create a new user/member
    // and delete the pending registration. This is a placeholder.
    console.log('Approving registration:', registration);
    
    // --- REPLACE THIS with your actual backend API call ---
    // Example:
    /*
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/registrations/approve/${registration.id}/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` },
      });

      if (res.ok) {
        // STEP 2: If the backend call is successful, refresh both lists
        console.log('Registration approved successfully.');
        fetchTeamMembers();
        fetchPendingRegistrations();
      } else {
        console.error('Failed to approve registration.');
      }
    } catch (error) {
      console.error('Error approving registration:', error);
    }
    */

    // This temporary frontend-only logic will be removed once you add the backend call.
    const newMemberFromReg = {
      id: Date.now(), // temporary ID
      name: registration.name,
      role: registration.requested_role,
      bio: registration.bio || '',
      username: registration.email.split('@')[0],
    };
    setTeamMembers(prev => [...prev, newMemberFromReg]);
    setPendingRegistrations(prev => prev.filter(r => r.id !== registration.id));
  };

  const handleDecline = async (registrationId: number) => {
    // STEP 1: Send a request to your backend to delete the registration.
    console.log('Declining registration:', registrationId);

    // --- REPLACE THIS with your actual backend API call ---
    // Example:
    /*
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/registrations/decline/${registrationId}/`, {
        method: 'POST', // or 'DELETE'
        headers: { 'Authorization': `Token ${token}` },
      });

      if (res.ok) {
        // STEP 2: If the backend call is successful, refresh the pending list
        console.log('Registration declined successfully.');
        fetchPendingRegistrations();
      } else {
        console.error('Failed to decline registration.');
      }
    } catch (error) {
      console.error('Error declining registration:', error);
    }
    */
    
    // This temporary frontend-only logic will be removed once you add the backend call.
    setPendingRegistrations(prev => prev.filter(r => r.id !== registrationId));
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setShowEdit(true);
  };

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
                  <button onClick={() => openEditModal(member)} className="p-2 text-blue-500 hover:text-blue-700" title="Edit"><FaEdit /></button>
                  <button onClick={() => handleDeleteMember(member.id)} className="p-2 text-red-500 hover:text-red-700" title="Remove"><FaTrash /></button>
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
                  <button onClick={() => handleApprove(reg)} className="p-2 text-green-600 hover:text-green-800" title="Accept"><FaCheck /></button>
                  <button onClick={() => handleDecline(reg.id)} className="p-2 text-red-500 hover:text-red-700" title="Decline"><FaTimes /></button>
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
              <h3 className="text-lg font-bold mb-4 text-gray-800">Add New Member</h3>
              {/* Form fields for name, role, username, password, etc. */}
              <form className="flex flex-col gap-3" onSubmit={handleAddMember}>
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="Name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} required />
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="Username" value={newMember.username} onChange={e => setNewMember({...newMember, username: e.target.value})} required />
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="Password" type="password" value={newMember.password} onChange={e => setNewMember({...newMember, password: e.target.value})} required />
                <select className="border rounded px-3 py-2 text-sm text-black" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})}>
                  <option>General Member</option>
                  <option>Instructor</option>
                  <option>Core Member</option>
                </select>
                <textarea className="border rounded px-3 py-2 text-sm text-black" placeholder="Bio (optional)" value={newMember.bio} onChange={e => setNewMember({...newMember, bio: e.target.value})} />
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="Google Scholar Link (optional)" value={newMember.google_scholar} onChange={e => setNewMember({...newMember, google_scholar: e.target.value})} />
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="GitHub Link (optional)" value={newMember.github} onChange={e => setNewMember({...newMember, github: e.target.value})} />
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="LinkedIn Link (optional)" value={newMember.linkedin} onChange={e => setNewMember({...newMember, linkedin: e.target.value})} />
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="Personal Website (optional)" value={newMember.website} onChange={e => setNewMember({...newMember, website: e.target.value})} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                  <input type="file" onChange={e => setPhotoFile(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                </div>
                <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 mt-2 hover:bg-blue-700 transition text-sm font-medium">Add Member</button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Member Modal */}
        {showEdit && editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowEdit(false)}>&times;</button>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Edit Member</h3>
              <form className="flex flex-col gap-3" onSubmit={handleUpdateMember}>
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="Name" value={editingMember.name} onChange={e => setEditingMember({...editingMember, name: e.target.value})} required />
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="Username" value={editingMember.username} onChange={e => setEditingMember({...editingMember, username: e.target.value})} required />
                <select className="border rounded px-3 py-2 text-sm text-black" value={editingMember.role} onChange={e => setEditingMember({...editingMember, role: e.target.value})}>
                  <option>General Member</option>
                  <option>Instructor</option>
                  <option>Core Member</option>
                </select>
                <textarea className="border rounded px-3 py-2 text-sm text-black" placeholder="Bio (optional)" value={editingMember.bio} onChange={e => setEditingMember({...editingMember, bio: e.target.value})} />
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="Google Scholar Link (optional)" value={editingMember.google_scholar || ''} onChange={e => setEditingMember({...editingMember, google_scholar: e.target.value})} />
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="GitHub Link (optional)" value={editingMember.github || ''} onChange={e => setEditingMember({...editingMember, github: e.target.value})} />
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="LinkedIn Link (optional)" value={editingMember.linkedin || ''} onChange={e => setEditingMember({...editingMember, linkedin: e.target.value})} />
                <input className="border rounded px-3 py-2 text-sm text-black" placeholder="Personal Website (optional)" value={editingMember.website || ''} onChange={e => setEditingMember({...editingMember, website: e.target.value})} />
                <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 mt-2 hover:bg-blue-700 transition text-sm font-medium">Save Changes</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamAdminPage;
