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
        
        {/* Header Section */}
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

        {/* Project Slide Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {items.slice(0, 4).map((project) => ( 
            <Link href={`/projects/${project._id}`} key={project._id} className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer relative bg-white/[0.03] border border-white/10 hover:border-[#00f6ff]/50 transition-all duration-500 overflow-hidden rounded-sm h-full"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  
                  {/* Image Side */}
                  <div className="w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden relative">
                    <img 
                      src={project.thumbnail} 
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
                        <span className="text-[9px] font-mono text-gray-500 uppercase">{project.date}</span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#00f6ff] transition-colors leading-tight italic uppercase tracking-tighter">
                        {project.title.replace(/ /g, '_')}
                      </h3>
                      
                      <p className="text-gray-400 text-xs md:text-sm font-mono leading-relaxed line-clamp-3 italic">
                        {project.summary}
                      </p>
                    </div>
                    
                    {/* Interaction Button */}
                    <div className="mt-6 flex items-center gap-2 text-[#00f6ff] text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                      <span>Enter_Repository</span>
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* --- VIEW MORE BUTTON --- */}
        <div className="mt-12 md:mt-20 flex justify-center">
          <Link href="/projects" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-6 py-4 md:px-10 md:py-4 group cursor-pointer text-center"
            >
              <div className="absolute inset-0 bg-[#00f6ff]/5 border border-[#00f6ff]/30 group-hover:border-[#00ff88]/60 group-hover:bg-[#00ff88]/5 transition-all duration-300 shadow-[0_0_15px_rgba(0,246,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]"></div>
              
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00f6ff]"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00f6ff]"></div>

              <div className="relative flex items-center justify-center gap-4">
                <span className="text-white font-mono text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">
                  View_All_Projects
                </span>
                <span className="text-[#00ff88] group-hover:translate-x-1 transition-transform duration-300 font-bold">
                  [ + ]
                </span>
              </div>
            </motion.div>
          </Link>
        </div>

      </div>
    </section>
  )
}