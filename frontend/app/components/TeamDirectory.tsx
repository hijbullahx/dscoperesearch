"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  google_scholar?: string;
  github?: string;
  linkedin?: string;
  website?: string;
};

const API_BASE = "http://127.0.0.1:8000";

function toAbsoluteUrl(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${API_BASE}${url}`;
}

export default function TeamDirectory() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/teammembers/`)
      .then((res) => res.json())
      .then((data: TeamMember[]) => {
        setMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const coreMembers = members.filter((member) => member.role?.toLowerCase().includes("core"));
  const instructors = members.filter(
    (member) =>
      !member.role?.toLowerCase().includes("core") &&
      member.role?.toLowerCase().includes("instructor")
  );
  const registeredMembers = members.filter(
    (member) =>
      !member.role?.toLowerCase().includes("core") &&
      !member.role?.toLowerCase().includes("instructor")
  );

  const renderMemberCircles = (list: TeamMember[]) => {
    if (list.length === 0) {
      return (
        <div className="bg-white/60 backdrop-blur rounded-xl border border-gray-200 p-6 text-gray-600 text-center">
          No members in this section.
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-6">
        {list.map((member) => (
          <div key={member.id} className="flex flex-col items-center text-center rounded-xl p-3 border border-transparent hover:border-gray-200 hover:bg-white/60 transition">
            <Link href={`/team/${member.id}`} className="flex flex-col items-center">
              {member.photo ? (
                <img
                  src={toAbsoluteUrl(member.photo)}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 border border-gray-200 text-gray-500 flex items-center justify-center text-2xl font-semibold">
                  {member.name?.[0] || "?"}
                </div>
              )}
              <span className="mt-3 text-sm font-semibold text-gray-900 underline underline-offset-2">
                {member.name}
              </span>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 tracking-tight text-gray-900">
          <span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
            Team
          </span>
        </h1>

        {loading ? (
          <div className="text-gray-500">Loading team members...</div>
        ) : members.length === 0 ? (
          <div className="bg-white/60 backdrop-blur rounded-xl border border-gray-200 p-8 text-gray-600">
            No team members found.
          </div>
        ) : (
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Core Members</h2>
              {renderMemberCircles(coreMembers)}
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Instructors</h2>
              {renderMemberCircles(instructors)}
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Registered Members</h2>
              {renderMemberCircles(registeredMembers)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
