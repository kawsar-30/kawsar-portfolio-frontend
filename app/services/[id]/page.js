'use client'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import Navbar from '@/components/common/Navbar'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ServiceDetail() {
  const { id } = useParams()
  // Redux থেকে এই নির্দিষ্ট সার্ভিসটি খুঁজে বের করা
  const service = useSelector((state) => state.services.items.find(s => s._id === id))

  if (!service) {
    return (
      <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center text-[#00f6ff] font-mono uppercase tracking-[0.3em]">
        &gt; Fetching_Service_Data_0%...
      </div>
    )
  }

  return (
    <>
      <Navbar />
      {/* স্পেসের জন্য খালি ডিভ */}
      <div className="h-24 w-full bg-[#0b0f14]"></div>
      
      <main className="min-h-screen bg-[#0b0f14] py-12 font-mono">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Back Button */}
          <Link href="/#services" className="text-gray-500 hover:text-[#00ff88] text-[10px] uppercase tracking-widest mb-12 inline-block transition-colors">
            &lt; [Return_to_Core_System]
          </Link>

          {/* Header Section */}
          <header className="border-l-2 border-[#00f6ff] pl-6 mb-16">
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-[#00ff88] text-xs font-bold uppercase tracking-[0.4em]"
            >
              {service.category || "Service_Module"}
            </motion.span>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              className="text-4xl md:text-6xl font-black text-white uppercase italic mt-2"
            >
              {service.title}
            </motion.h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Description */}
            <div className="lg:col-span-7">
              <div className="bg-[#0d121a] border border-white/5 p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00f6ff]"></div>
                <h3 className="text-[#00f6ff] text-sm mb-6 uppercase tracking-widest font-bold">// Overview</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Right: Media/Icon Gallery */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-[#00ff88] text-sm uppercase tracking-widest font-bold">// Visual_Assets</h3>
              {service.media?.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="relative group border border-white/10 overflow-hidden"
                >
                  {item.mediaType === 'image' ? (
                    <img src={item.url} alt={item.originalName} className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : item.mediaType === 'video' ? (
                    <video controls className="w-full"><source src={item.url} /></video>
                  ) : (
                    <div className="p-4 bg-white/5 text-[10px] text-gray-500 uppercase">{item.originalName}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  )
}