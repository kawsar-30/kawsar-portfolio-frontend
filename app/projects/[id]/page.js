'use client'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import Navbar from '@/components/common/Navbar'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// PDF and Swiper imports
import { Document, Page, pdfjs } from 'react-pdf'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Worker initialize for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

/* ================= PDF SLIDER ================= */
const PDFSlider = ({ url }) => {
  const [numPages, setNumPages] = useState(null)
  const [containerWidth, setContainerWidth] = useState(800)

  // Cloudinary extension safety
  const pdfUrl = url.toLowerCase().includes('.pdf') ? url : `${url}.pdf`

  useEffect(() => {
    const updateWidth = () => {
      const w = window.innerWidth
      if (w < 480) setContainerWidth(w - 24)
      else if (w < 768) setContainerWidth(w - 40)
      else if (w < 1024) setContainerWidth(650)
      else setContainerWidth(800)
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  return (
    <div className="w-full bg-[#0d121a] rounded-lg border border-[#00f6ff]/20 p-2 sm:p-4 md:p-6 shadow-[0_0_30px_rgba(0,246,255,0.1)] overflow-hidden">
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        className="flex justify-center" // <-- Center PDF horizontally
        loading={
          <div className="h-60 flex items-center justify-center text-[#00f6ff] animate-pulse font-mono text-xs italic">
            &gt; DECRYPTING_SECURE_STORAGE...
          </div>
        }
        onLoadError={(e) => console.error('PDF Load Error:', e)}
      >
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ type: 'fraction' }}
          centeredSlides
          slidesPerView={1}
          className="w-full"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <SwiperSlide
              key={index}
              className="flex justify-center items-center bg-[#0b0f14] py-3 sm:py-4"
            >
              <Page
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={containerWidth}
                className="mx-auto shadow-2xl border border-white/5" // <-- mx-auto to center
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Document>

      {/* Backup link */}
      <div className="mt-4 text-center">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-[#00ff88] hover:underline opacity-40 italic font-mono"
        >
          [ MANUAL_DECRYPTION_LINK ]
        </a>
      </div>
    </div>
  )
}

/* ================= MAIN PAGE ================= */
export default function ProjectDetail() {
  const { id } = useParams()
  const project = useSelector((state) =>
    state.projects.items.find((p) => p._id === id)
  )

  if (!project)
    return (
      <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center text-[#00f6ff] font-mono animate-pulse uppercase">
        &gt; Connecting_to_Remote_Storage...
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
          {/* HEADER */}
          <motion.header
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12 md:mb-16 border-l-4 border-[#00f6ff] pl-4 md:pl-6"
          >
            <span className="text-[#00ff88] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
              {project.category}
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-7xl font-black uppercase italic mt-4 tracking-tighter break-words">
              {project.title.replace(/ /g, '_')}
            </h1>

            <p className="mt-6 md:mt-8 text-gray-400 text-xs sm:text-sm max-w-3xl leading-relaxed border-t border-white/5 pt-6 italic">
              {project.description}
            </p>
          </motion.header>

          {/* CONTENT */}
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

      {/* Swiper Colors */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #00f6ff !important;
        }
        .swiper-pagination-fraction {
          color: #00ff88 !important;
          font-family: monospace;
          font-size: 12px;
        }
      `}</style>
    </>
  )
}
