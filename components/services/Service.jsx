'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { fetchServices } from '@/redux/slices/serviceSlice'

export default function Services() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.services);
  const [mounted, setMounted] = useState(false);

  const INITIAL_DISPLAY_COUNT = 6;

  useEffect(() => {
    setMounted(true);
    if (status === 'idle') dispatch(fetchServices());
  }, [status, dispatch]);

  if (!mounted) return null;

  const displayedServices = items?.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <section id="services" className="relative min-h-screen py-20 md:py-32 bg-[#0b0f14] overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,246,255,0.1),transparent_70%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
          <motion.h2 className="text-4xl md:text-6xl font-black text-[#00f6ff] uppercase tracking-tighter italic">SERVICES</motion.h2>
          <motion.div initial={{ width: 0 }} whileInView={{ width: '100px' }} className="h-1.5 bg-[#00ff88] mt-3 shadow-[0_0_20px_#00ff88]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-left">
          {displayedServices && displayedServices.map((service, index) => {
            const mediaData = Array.isArray(service.media) ? service.media[0] : service.media;
            const iconUrl = mediaData?.url;

            return (
              <Link href={`/services/${service._id}`} key={service._id} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-[#0d121a]/90 backdrop-blur-md border border-white/5 group-hover:border-[#00f6ff]/40 p-6 h-full min-h-[350px] flex flex-col justify-between transition-all duration-500 rounded-[1.5rem] overflow-hidden shadow-2xl"
                >
                  <div className="relative z-10">
                    <div className="w-16 h-16 mb-6 flex items-center justify-center bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                      {iconUrl ? (
                        <img src={iconUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="text-3xl grayscale opacity-50 group-hover:grayscale-0 transition-all">🛠️</div>
                      )}
                    </div>
                    
                    {/* 🔥 Full Title - No line-clamp */}
                    <h3 className="text-lg font-bold text-white group-hover:text-[#00f6ff] transition-colors uppercase tracking-tight mb-3 leading-tight font-mono whitespace-normal break-words">
                      {service.title.replace(/ /g, '_')}
                    </h3>
                    
                    <p className="text-gray-400 text-[11px] font-mono leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  <div className="relative z-10 pt-4 flex justify-between items-center border-t border-white/5 mt-4">
                    <span className="text-[8px] text-[#00ff88] font-bold border border-[#00ff88]/30 px-2 py-1 uppercase tracking-widest">
                      {service.category || 'SEC_MODULE'}
                    </span>
                    <div className="px-3 py-1 rounded-full border border-[#00f6ff]/40 text-[#00f6ff] text-[9px] font-bold uppercase group-hover:bg-[#00f6ff] group-hover:text-[#0b0f14] transition-all">
                      Details_&gt;
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  )
}