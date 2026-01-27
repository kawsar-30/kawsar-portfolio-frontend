'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSkills } from '@/redux/slices/skillSlice'
import { motion } from 'framer-motion'

export default function Skills() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.skills);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSkills());
    }
  }, [status, dispatch]);

  if (status === 'failed') {
    console.error("Skill Load Error:", error);
  }

  return (
    <section id="skills" className="py-16 md:py-24 bg-[#0b0f14] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Title Section */}
        <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00f6ff] uppercase tracking-tighter italic"
          >
            SKILL_INFRASTRUCTURE
          </motion.h2>
          <div className="h-1 w-20 md:w-28 bg-[#00ff88] mt-3 shadow-[0_0_15px_#00ff88]"></div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {items && items.map((skill, index) => (
            <motion.div 
              key={skill._id || index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center"
            >
              <div className="w-full min-h-[50px] md:h-14 bg-[#0d121a] border border-[#00f6ff]/20 rounded-full flex items-center px-5 sm:px-6 transition-all duration-300 group-hover:border-[#00ff88] group-hover:bg-[#00f6ff]/5 relative overflow-hidden">
                
                <div className="relative z-10 flex items-center w-full gap-3 md:gap-4">
                  {/* Skill Icon - Original Color Always */}
                  <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                    {skill.icon?.url ? (
                      <img 
                        src={skill.icon.url} 
                        alt={skill.name} 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-300 font-mono text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase group-hover:text-white transition-colors truncate">
                      {skill.name}
                    </span>
                    <span className="text-[#00ff88] text-[7px] font-mono opacity-40 uppercase">
                      {`> ${skill.category || 'GENERAL_CYBER'}`}
                    </span>
                  </div>
                </div>
                
                {/* Scan Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff88]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 border-t border-[#00f6ff]/10 pt-8 flex justify-between items-center">
           <p className="text-[9px] text-gray-600 font-mono tracking-[0.2em] uppercase">
             &gt; STATUS: {status === 'loading' ? 'FETCHING...' : 'ONLINE'}
           </p>
           <p className="text-[9px] text-gray-600 font-mono tracking-[0.2em] uppercase">
             VULN_SCAN: CLEAN
           </p>
        </div>
      </div>
    </section>
  )
}