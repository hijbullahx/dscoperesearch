"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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

export default function TeamMemberDetailPage() {
  const params = useParams<{ id: string }>();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/teammembers/${params.id}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Member not found");
        }
        return res.json();
      })
      .then((data: TeamMember) => {
        setMember(data);
        setLoading(false);
      })
      .catch(() => {
        setMember(null);
        setLoading(false);
      });
  }, [params?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/team" className="text-sm text-gray-600 hover:text-gray-900 transition underline underline-offset-2">
          Back to Team
        </Link>

        {loading ? (
          <div className="mt-6 text-gray-500">Loading member details...</div>
        ) : !member ? (
          <div className="mt-6 bg-white/60 backdrop-blur rounded-xl border border-gray-200 p-8 text-gray-600">
            Member not found.
          </div>
        ) : (
          <div className="mt-6 bg-white/70 backdrop-blur rounded-xl border border-gray-200 p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
              {member.photo ? (
                <img
                  src={toAbsoluteUrl(member.photo)}
                  alt={member.name}
                  className="w-28 h-28 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-200 border border-gray-200 text-gray-500 flex items-center justify-center text-3xl font-semibold">
                  {member.name?.[0] || "?"}
                </div>
              )}
              <h1 className="mt-5 text-3xl font-bold text-gray-900">{member.name}</h1>
              <p className="text-sm text-blue-700 font-medium mt-1">{member.role}</p>
            </div>

            {member.bio && <p className="text-gray-700 mt-6 leading-relaxed">{member.bio}</p>}

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {member.google_scholar && (
                <a
                  href={member.google_scholar}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                  Google Scholar
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                  GitHub
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                  LinkedIn
                </a>
              )}
              {member.website && (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
