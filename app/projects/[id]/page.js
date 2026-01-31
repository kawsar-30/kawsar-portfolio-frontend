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

import 'swiper/css'; 
import 'swiper/css/navigation'; 
import 'swiper/css/pagination'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Worker initialize for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PDFSlider = ({ url }) => {
  const [numPages, setNumPages] = useState(null)
  const [containerWidth, setContainerWidth] = useState(800)

  // Extension fix for Cloudinary
  const pdfUrl = url.toLowerCase().includes('.pdf') ? url : `${url}.pdf`;

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      // Mobile and Desktop width calculation
      setContainerWidth(width < 768 ? width - 32 : 800);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div className="w-full bg-[#0d121a] rounded-lg border border-[#00f6ff]/20 p-2 md:p-6 shadow-[0_0_30px_rgba(0,246,255,0.1)] overflow-hidden">
      <Document 
        file={pdfUrl} 
        onLoadSuccess={({ numPages }) => setNumPages(numPages)} 
        className="flex flex-col items-center justify-center" // Center the document
        loading={
          <div className="h-60 flex flex-col items-center justify-center text-[#00f6ff] animate-pulse font-mono text-xs italic">
            <span className="mb-2 tracking-widest">&gt; DECRYPTING_SECURE_STORAGE...</span>
          </div>
        }
        onLoadError={(error) => console.error("PDF Load Error:", error)}
      >
        <Swiper 
          modules={[Navigation, Pagination]} 
          navigation 
          pagination={{ type: 'fraction' }} 
          centeredSlides={true} // <-- Perfectly centers the slides
          slidesPerView={1}
          className="w-full cyber-swiper"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <SwiperSlide key={index} className="flex justify-center items-center bg-[#0b0f14] py-4">
              <div className="flex justify-center w-full">
                <Page 
                  pageNumber={index + 1} 
                  renderTextLayer={false} 
                  renderAnnotationLayer={false} 
                  width={containerWidth}
                  className="shadow-2xl border border-white/5 mx-auto" // Center the page within slide
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Document>
      
      {/* Backup link for 401 error */}
      <div className="mt-4 text-center">
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#00ff88] hover:underline opacity-40 italic font-mono">
          [ MANUAL_DECRYPTION_LINK ]
        </a>
      </div>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const project = useSelector((state) => state.projects.items.find(p => p._id === id))

  if (!project) return (
    <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center text-[#00f6ff] font-mono animate-pulse uppercase">
      &gt; Connecting_to_Remote_Storage...
    </div>
  )

  // Asset Detection: Prioritize PDF by checking originalName or URL
  const mainAsset = project.media?.find(m => {
    const name = m.originalName?.toLowerCase() || "";
    const url = m.url?.toLowerCase() || "";
    return name.endsWith('.pdf') || url.includes('.pdf');
  }) || project.media?.[0];

  const isPDF = mainAsset?.originalName?.toLowerCase().endsWith('.pdf') || 
                mainAsset?.url.toLowerCase().includes('.pdf');

  return (
    <>
      <Navbar />
      <div className="h-24 bg-[#0b0f14]"></div>
      <main className="min-h-screen bg-[#0b0f14] pb-20 font-mono text-white">
        <div className="max-w-6xl mx-auto px-4">
          
          <motion.header 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-16 border-l-4 border-[#00f6ff] pl-6"
          >
            <span className="text-[#00ff88] text-xs font-bold tracking-[0.3em] uppercase">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase italic mt-4 tracking-tighter">
              {project.title.replace(/ /g, '_')}
            </h1>
            <p className="mt-8 text-gray-400 text-sm max-w-3xl leading-relaxed border-t border-white/5 pt-6 italic">
              {project.description}
            </p>
          </motion.header>

          <div className="mt-12 flex justify-center">
            {isPDF ? (
              <PDFSlider url={mainAsset.url} />
            ) : (
              <div className="relative group overflow-hidden border border-white/10 rounded-lg shadow-2xl w-full">
                 <img 
                    src={mainAsset?.url} 
                    className="w-full grayscale hover:grayscale-0 transition-all duration-700" 
                    alt="project_asset" 
                 />
                 <div className="absolute inset-0 bg-[#00f6ff]/5 pointer-events-none"></div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
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