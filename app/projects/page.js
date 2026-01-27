'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjects } from '@/redux/slices/projectSlice'
import Navbar from '@/components/common/Navbar'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.projects);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProjects());
  }, [status, dispatch]);

  return (
    <main className="min-h-screen bg-[#0b0f14] font-mono overflow-x-hidden">
      <Navbar />
      <div className="h-20 md:h-28 w-full"></div>

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12 md:mb-16 border-l-4 border-[#00f6ff] pl-4 md:pl-6"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-[0.1em]">Project_Archives</h2>
            <p className="text-[#00ff88] text-xs md:text-sm mt-3 uppercase tracking-widest font-bold">
              <span className="opacity-50">&gt; STATUS:</span> {status === 'loading' ? 'SYNCING...' : 'ONLINE'} // 
              <span className="opacity-50"> Total_Units:</span> {items.length}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {items.map((project, index) => (
              <Link href={`/projects/${project._id}`} key={project._id} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-[#0d121a] border border-white/5 hover:border-[#00f6ff]/30 transition-all duration-500 overflow-hidden rounded-sm h-full"
                >
                  <div className="flex flex-col sm:flex-row h-full">
                    <div className="w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden relative">
                      <img src={project.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={project.title} />
                    </div>

                    <div className="w-full sm:w-3/5 p-6 flex flex-col justify-between bg-gradient-to-br from-[#0d121a] to-[#0b0f14]">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                           <span className="text-[9px] text-[#00ff88] border border-[#00ff88]/20 px-2 py-0.5 rounded uppercase font-black bg-[#00ff88]/5">{project.category}</span>
                           <span className="text-[9px] text-gray-600 font-bold uppercase">{project.date}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-[#00f6ff] transition-colors leading-tight italic uppercase tracking-tighter">
                          {project.title.replace(/ /g, '_')}
                        </h3>
                        <p className="text-gray-500 text-xs font-mono line-clamp-3 italic">{project.summary}</p>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5 text-[#00f6ff] text-[10px] font-bold uppercase">
                        <span>Decrypt_Details →</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}