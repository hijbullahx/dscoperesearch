"use client";
import { useEffect, useState } from 'react';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo?: string;
};

export default function TeamAdminPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/teammembers/')
      .then(res => res.json())
      .then(data => {
        setTeam(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Team Admin</h1>
        {loading ? (
          <div className="text-gray-500 text-center py-8">Loading team members...</div>
        ) : team.length === 0 ? (
          <div className="bg-gray-50 border rounded-lg p-8 text-gray-600 text-center">
            No team members found.
          </div>
        ) : (
          <div className="space-y-4">
            {team.map(member => (
              <div key={member.id} className="flex items-center gap-4 bg-gray-50 border rounded-lg p-4">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-12 h-12 rounded-full object-cover border" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold border">
                    {member.name[0]}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900">{member.name}</div>
                  <div className="text-sm text-gray-600">{member.role}</div>
                  {member.bio && <div className="text-xs text-gray-500 mt-1">{member.bio}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
