'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  return (
    <div className="w-full border-b border-gray-200 bg-white/60 backdrop-blur-xl sticky top-0 z-50">

      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-lg font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
            DeepScope
          </span>
        </h1>

        {/* Nav Links */}
        <div className="flex gap-8 text-sm text-gray-600">

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

          <Link href="#" className="hover:text-black transition">
            Team
          </Link>

        </div>

      </div>

    </div>
  )
}