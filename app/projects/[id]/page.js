'use client'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import Navbar from '@/components/common/Navbar'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// PDFSlider-ke dynamic import kora holo (SSR off)
const PDFSlider = dynamic(() => import('@/components/PDFSliderComponent'), { 
  ssr: false,
  loading: () => (
    <div className="h-60 flex items-center justify-center text-[#00f6ff] animate-pulse font-mono text-xs italic">
      {"> DECRYPTING_SECURE_STORAGE..."}
    </div>
  )
})

export default function ProjectDetail() {
  const { id } = useParams()
  const project = useSelector((state) =>
    state.projects.items.find((p) => p._id === id)
  )

  if (!project)
    return (
      <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center text-[#00f6ff] font-mono animate-pulse uppercase">
        {"> Connecting_to_Remote_Storage..."}
      </div>
    )

  const mainAsset =
    project.media?.find((m) => {
      const name = m.originalName?.toLowerCase() || ''
      const url = m.url?.toLowerCase() || ''
      return name.endsWith('.pdf') || url.includes('.pdf')
    }) || project.media?.[0]

  const isPDF =
    mainAsset?.originalName?.toLowerCase().endsWith('.pdf') ||
    mainAsset?.url?.toLowerCase().includes('.pdf')

  return (
    <>
      <Navbar />
      <div className="h-20 md:h-24 bg-[#0b0f14]" />
      <main className="min-h-screen bg-[#0b0f14] pb-20 font-mono text-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.header
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12 md:mb-16 border-l-4 border-[#00f6ff] pl-4 md:pl-6"
          >
            <span className="text-[#00ff88] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
              {project.category}
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-7xl font-black uppercase italic mt-4 tracking-tighter break-words">
              {project.title?.replace(/ /g, '_')}
            </h1>
            <p className="mt-6 md:mt-8 text-gray-400 text-xs sm:text-sm max-w-3xl leading-relaxed border-t border-white/5 pt-6 italic">
              {project.description}
            </p>
          </motion.header>

          <div className="mt-10 md:mt-12 flex justify-center">
            {isPDF ? (
              <PDFSlider url={mainAsset.url} />
            ) : (
              <div className="relative group overflow-hidden border border-white/10 rounded-lg shadow-2xl w-full max-h-[80vh]">
                <img
                  src={mainAsset?.url}
                  className="w-full h-auto max-h-[80vh] object-contain grayscale hover:grayscale-0 transition-all duration-700"
                  alt="project_asset"
                />
                <div className="absolute inset-0 bg-[#00f6ff]/5 pointer-events-none"></div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}