'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjects } from '@/redux/slices/projectSlice'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Projects() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((state) => state.projects)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProjects())
  }, [status, dispatch])

  if (status === 'loading') {
    return (
      <div className="bg-[#0b0f14] py-24 text-center font-mono text-[#00f6ff] animate-pulse">
        &gt; INITIALIZING_ARCHIVE_DATA...
      </div>
    )
  }

  return (
    <section id="projects" className="py-16 md:py-24 bg-[#0b0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 md:mb-16 border-l-4 border-[#00f6ff] pl-4 md:pl-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-[0.15em]"
          >
            Project_Archives
          </motion.h2>
          <p className="text-[#00ff88] font-mono text-[10px] sm:text-xs mt-2 font-bold tracking-widest uppercase italic">
            &gt; SELECTED_WORKS / {new Date().getFullYear()} // STATUS: ONLINE
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {items.map((project) => {
            const thumbnailUrl =
              project.media?.[0]?.url ||
              'https://via.placeholder.com/400x300?text=No+Thumbnail'

            return (
              <Link
                href={`/projects/${project._id}`}
                key={project._id}
                className="block group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative h-full bg-[#0e141b] border border-white/10 rounded-lg overflow-hidden
                             transition-all duration-500
                             hover:border-[#00f6ff]/50
                             hover:shadow-[0_0_40px_rgba(0,246,255,0.12)]"
                >
                  {/* Glow line */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f6ff] to-transparent opacity-0 group-hover:opacity-100 transition" />

                  <div className="flex flex-col sm:flex-row h-full">
                    
                    {/* Image */}
                    <div className="relative w-full sm:w-2/5 aspect-video sm:aspect-auto sm:h-auto overflow-hidden">
                      <img
                        src={thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-110 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-[#00f6ff]/10"></div>
                    </div>

                    {/* Content */}
                    <div className="w-full sm:w-3/5 p-5 md:p-8 flex flex-col justify-between">
                      <div>
                        <span className="inline-block mb-4 text-[9px] font-mono text-[#00ff88] border border-[#00ff88]/30 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                          {project.category}
                        </span>

                        <h3 className="text-lg md:text-2xl font-black uppercase italic tracking-tight text-white group-hover:text-[#00f6ff] transition-colors">
                          {project.title.replace(/ /g, '_')}
                        </h3>

                        <p className="mt-3 text-gray-400 text-xs md:text-sm font-mono leading-relaxed line-clamp-3 italic">
                          {project.description}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center gap-3 text-[#00f6ff] text-[10px] font-bold uppercase tracking-widest
                                      group-hover:translate-x-2 transition-transform">
                        <span>Enter_Repository</span>
                        <span className="text-lg">→</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
