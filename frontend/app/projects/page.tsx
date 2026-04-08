'use client'

import { useEffect, useState } from 'react'
import ProjectCard from '../components/ProjectCard'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/projects/')
      .then(res => res.json())
      .then(data => setProjects(data))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-8 py-12">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Projects
        </h1>

        <div className="space-y-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

      </div>
    </div>
  )
}