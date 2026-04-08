'use client'

import ProjectCard from './components/ProjectCard'
import { useEffect, useState } from 'react'

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/projects/')
      .then(res => res.json())
      .then(data => setProjects(data))
  }, [])

  return (
  <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-8 py-12">
    <div className="max-w-4xl mx-auto">
      
      <h1 className="text-4xl font-bold mb-10 tracking-tight text-gray-900">
  <span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
    DeepScope Research
  </span>
</h1>

      <div className="space-y-6">
        {projects.map((project: any) => (
  <ProjectCard key={project.id} project={project} />
))}
      </div>

    </div>
  </div>
)
}