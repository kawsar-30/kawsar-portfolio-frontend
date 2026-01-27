'use client'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import Navbar from '@/components/common/Navbar'
import { motion } from 'framer-motion'
import Link from 'next/link'


const MediaViewer = ({ item }) => {
  if (item.mediaType === 'pdf') {
    return <iframe src={item.url} className="w-full h-[500px] md:h-[800px] rounded-lg border border-white/10" title={item.originalName} />;
  }
  if (item.mediaType === 'video') {
    return <video controls className="w-full rounded-lg border border-white/10"><source src={item.url} type="video/mp4" /></video>;
  }
  return <img src={item.url} className="w-full h-auto rounded-lg border border-white/10 shadow-2xl" alt={item.originalName} />;
}

export default function ProjectDetail() {
  const { id } = useParams()
  const project = useSelector((state) => state.projects.items.find(p => p._id === id))

  if (!project) return <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center text-[#00f6ff] font-mono">LOADING_ENCRYPTED_DATA...</div>


  const thumbnail = project.media?.find(m => m.mediaType === 'image')?.url;

  return (
    <>
      <Navbar />
      <div className="h-20 md:h-24 w-full bg-[#0b0f14]"></div>
      <main className="min-h-screen bg-[#0b0f14] pt-8 pb-20 font-mono">
        <div className="max-w-6xl mx-auto px-4">
          
          <Link href="/projects" className="text-gray-500 hover:text-[#00f6ff] text-[10px] uppercase tracking-[0.4em] mb-10 inline-block">
            &lt; Back_to_Archives
          </Link>

          <header className="mb-16 border-l-4 border-[#00f6ff] pl-6">
            <span className="text-[#00ff88] text-xs font-bold tracking-widest uppercase">{project.category}</span>
            <h1 className="text-3xl md:text-6xl font-black text-white uppercase italic mt-4">{project.title.replace(/ /g, '_')}</h1>
            <p className="mt-6 text-gray-400 text-sm max-w-3xl leading-relaxed">{project.description}</p>
          </header>

          {/* Media Section */}
          <div className="space-y-12">
            {project.media?.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-[#00f6ff] text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 bg-[#00f6ff] rounded-full animate-pulse"></span>
                  Attachment_{index + 1}: {item.originalName}
                </div>
                <MediaViewer item={item} />
              </motion.div>
            ))}
          </div>

        </div>
      </main>
    </>
  )
}