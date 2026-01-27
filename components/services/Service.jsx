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

  // শুরুতে কতটি সার্ভিস দেখাবে
  const INITIAL_DISPLAY_COUNT = 4;

  useEffect(() => {
    setMounted(true);
    if (status === 'idle') dispatch(fetchServices());
  }, [status, dispatch]);

  if (!mounted) return null;

  // শুধু প্রথম ৪টি সার্ভিস ফিল্টার করে নেওয়া
  const displayedServices = items?.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <section id="services" className="relative min-h-screen py-20 md:py-32 bg-[#0b0f14] overflow-hidden flex flex-col items-center">
      
      {/* --- Cyberpunk Background Decor --- */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,246,255,0.1),transparent_70%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        
        {/* --- Section Header --- */}
        <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-[#00f6ff] uppercase tracking-tighter italic"
          >
            SERVICES
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            viewport={{ once: true }}
            className="h-1.5 bg-[#00ff88] mt-3 shadow-[0_0_20px_#00ff88]"
          />
        </div>

        {/* --- Services Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {displayedServices && displayedServices.map((service, index) => {
            // মিডিয়া অ্যারে থেকে প্রথম ইমেজ ইউআরএল খুঁজে বের করা
            const iconUrl = service.media?.find(m => m.mediaType === 'image')?.url;

            return (
              <Link href={`/services/${service._id}`} key={service._id} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-[#0d121a]/90 backdrop-blur-md border border-white/5 group-hover:border-[#00f6ff]/40 p-6 md:p-8 h-full min-h-[340px] flex flex-col justify-between transition-all duration-500 rounded-[1.5rem] overflow-hidden shadow-2xl"
                >
                  {/* Top Animated Scan Line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ff88] opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_linear_infinite]"></div>

                  <div className="relative z-10">
                    {/* Dynamic Icon/Image */}
                    <div className="w-12 h-12 md:w-16 md:h-16 mb-6">
                      {iconUrl ? (
                        <img 
                          src={iconUrl} 
                          alt={service.title} 
                          className="w-full h-full object-contain filter group-hover:drop-shadow-[0_0_10px_rgba(0,246,255,0.6)] transition-all duration-300" 
                        />
                      ) : (
                        <div className="text-4xl">🛠️</div>
                      )}
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#00f6ff] transition-colors uppercase tracking-tight mb-4 leading-tight font-mono">
                      {service.title.replace(/ /g, '_')}
                    </h3>
                    
                    <p className="text-gray-400 text-xs md:text-sm font-mono leading-relaxed line-clamp-4 group-hover:text-gray-300 transition-colors">
                      {service.description}
                    </p>
                  </div>

                  {/* Card Footer with Individual Rounded Button */}
                  <div className="relative z-10 pt-6 flex justify-between items-center">
                    <span className="text-[9px] md:text-[10px] text-[#00ff88] font-bold border border-[#00ff88]/30 px-3 py-1 uppercase tracking-widest bg-[#00ff88]/5">
                      {service.category || 'SEC_MODULE'}
                    </span>

                    {/* Individual Rounded Button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-1.5 rounded-full border border-[#00f6ff]/40 text-[#00f6ff] text-[10px] font-bold uppercase tracking-widest group-hover:bg-[#00f6ff] group-hover:text-[#0b0f14] group-hover:border-[#00f6ff] transition-all duration-300 shadow-[0_0_10px_rgba(0,246,255,0.1)] group-hover:shadow-[0_0_15px_rgba(0,246,255,0.4)]"
                    >
                      Details_&gt;
                    </motion.div>
                  </div>

                  {/* Cyber Corner Accents */}
                  <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/10 group-hover:border-[#00f6ff] transition-all rounded-tr-[1.5rem]"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/10 group-hover:border-[#00ff88] transition-all rounded-bl-[1.5rem]"></div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* --- Main View More Button (Rounded) --- */}
        {items?.length > INITIAL_DISPLAY_COUNT && (
          <div className="mt-16 flex justify-center">
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 255, 136, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-4 bg-[#00ff88]/5 border-2 border-[#00ff88] text-[#00ff88] font-mono text-sm font-bold tracking-[0.2em] uppercase rounded-full transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 group-hover:text-[#0b0f14] transition-colors duration-300 flex items-center gap-2">
                  Execute_Full_Scan <span className="text-lg">→</span>
                </span>
                <div className="absolute inset-0 w-0 bg-[#00ff88] group-hover:w-full transition-all duration-500 ease-out z-0"></div>
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700"></div>
              </motion.button>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(340px); opacity: 0; }
        }
      `}</style>
    </section>
  )
}