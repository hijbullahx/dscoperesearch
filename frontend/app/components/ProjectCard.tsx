type Project = {
  id: number
  title: string
  description: string
  github_link?: string
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {project.title}
      </h2>

      <p className="text-gray-700 mb-3">
        {project.description}
      </p>

      {project.github_link && (
        <a
          href={project.github_link}
          target="_blank"
          className="text-sm text-blue-600 hover:underline"
        >
          View Project →
        </a>
      )}

    </div>
  )
}