'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjects } from '@/redux/slices/projectSlice'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Projects() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.projects);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <div className="bg-[#0b0f14] py-24 text-center font-mono text-[#00f6ff] animate-pulse">
        &gt; INITIALIZING_ARCHIVE_DATA...
      </div>
    );
  }

  return (
    <section id="projects" className="py-16 md:py-24 bg-[#0b0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 md:mb-16 border-l-4 border-[#00f6ff] pl-4 md:pl-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-[0.1em] md:tracking-[0.2em]"
          >
            Project_Archives
          </motion.h2>
          <p className="text-[#00ff88] font-mono text-[10px] sm:text-xs md:text-sm mt-2 font-bold tracking-widest uppercase italic">
            &gt; SELECTED_WORKS / {new Date().getFullYear()} // STATUS: ONLINE
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {items.map((project) => {
            // Thumbnail selection logic: media array-r 1st element image hole oita nibe
            const thumbnailUrl = project.media && project.media.length > 0 
              ? project.media[0].url 
              : 'https://via.placeholder.com/400x300?text=No+Thumbnail';

            return (
              <Link href={`/projects/${project._id}`} key={project._id} className="block">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group cursor-pointer relative bg-white/[0.03] border border-white/10 hover:border-[#00f6ff]/50 transition-all duration-500 overflow-hidden rounded-sm h-full"
                >
                  <div className="flex flex-col sm:flex-row h-full">
                    
                    {/* Image Side - Only Thumbnail */}
                    <div className="w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden relative">
                      <img 
                        src={thumbnailUrl} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        alt={project.title} 
                      />
                      <div className="absolute inset-0 bg-[#00f6ff]/10 mix-blend-overlay"></div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full sm:w-3/5 p-5 md:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[9px] font-mono text-[#00ff88] border border-[#00ff88]/30 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                            {project.category}
                          </span>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#00f6ff] transition-colors leading-tight italic uppercase tracking-tighter">
                          {project.title.replace(/ /g, '_')}
                        </h3>
                        
                        <p className="text-gray-400 text-xs md:text-sm font-mono leading-relaxed line-clamp-3 italic">
                          {project.description}
                        </p>
                      </div>
                      
                      <div className="mt-6 flex items-center gap-2 text-[#00f6ff] text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
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