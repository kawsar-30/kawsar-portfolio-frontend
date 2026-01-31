'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCertifications } from '@/redux/slices/certificationSlice'

// PDF & Swiper
import { Document, Page, pdfjs } from 'react-pdf'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'; 
import 'swiper/css/navigation'; 
import 'swiper/css/pagination'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Using a stable CDN worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// --- PDF Modal Viewer Sub-Component ---
const PDFModalViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="w-full bg-[#0d121a] rounded-sm overflow-hidden min-h-[350px]">
      <Document 
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)} 
        loading={<div className="text-[#00f6ff] font-mono p-20 text-center animate-pulse uppercase tracking-[0.3em]">Decrypting_Payload...</div>}
        error={<div className="text-red-500 font-mono p-10 text-center uppercase text-xs">Secure_Link_Broken: CORS_REJECTED</div>}
      >
        <Swiper modules={[Navigation, Pagination]} navigation pagination={{ type: 'fraction' }} className="w-full">
          {Array.from(new Array(numPages), (el, index) => (
            <SwiperSlide key={index} className="flex justify-center bg-[#0b0f14] py-2 md:py-6">
              <Page 
                pageNumber={index + 1} 
                renderTextLayer={false} 
                renderAnnotationLayer={false} 
                width={windowWidth < 768 ? windowWidth - 40 : 850}
                className="shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Document>
    </div>
  )
}

export default function Certifications() {
  const dispatch = useDispatch();
  const { items: certificationsData, status } = useSelector((state) => state.certifications);
  const [selectedCert, setSelectedCert] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true);
    if (status === 'idle') dispatch(fetchCertifications());
  }, [status, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  if (!mounted) return null;

  return (
    <section id="certifications" className="py-24 bg-[#0b0f14] font-mono relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,246,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,246,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black text-[#00f6ff] uppercase tracking-widest italic"
          >
            Certifications_
          </motion.h2>
          
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            transition={{ duration: 0.8 }}
            className="h-1.5 bg-[#00ff88] mt-2 shadow-[0_0_15px_#00ff88]"
          />
          
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-4 opacity-60 italic font-bold">
            Verified_Cyber_Credentials
          </p>
        </div>

        {/* Dynamic List Layout */}
        <div className="space-y-4">
          {certificationsData && certificationsData.map((cert, index) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCert(cert)}
              className="group relative flex items-center justify-between p-5 border border-white/5 hover:border-[#00f6ff]/40 bg-white/[0.01] hover:bg-[#00f6ff]/5 transition-all cursor-pointer rounded-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-6">
                <span className="text-gray-700 font-black text-[10px] group-hover:text-[#00f6ff]/50 transition-colors italic">
                  {index < 9 ? `0${index + 1}` : index + 1}
                </span>
                <div>
                  <h3 className="text-sm md:text-lg font-bold text-white group-hover:text-[#00f6ff] transition-colors uppercase italic tracking-tight leading-none">
                    {cert.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-semibold italic">
                    {cert.issuer}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                  {formatDate(cert.issueDate)}
                </span>
                <span className="text-[#00f6ff] group-hover:rotate-90 transition-transform font-bold">
                  [+]
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Responsive Modal */}
        <AnimatePresence>
          {selectedCert && (() => {
            const assetUrl = selectedCert.media?.[0]?.url;
            const isPDF = assetUrl?.toLowerCase().includes('.pdf') || 
                          selectedCert.media?.[0]?.originalName?.toLowerCase().endsWith('.pdf');

            return (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] flex items-center justify-center p-3 md:p-10 bg-black/90 backdrop-blur-xl"
                onClick={() => setSelectedCert(null)}
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                  className="relative max-w-5xl w-full bg-[#0d121a] border border-[#00f6ff]/20 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex justify-between items-center p-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex flex-col">
                       <span className="text-[#00f6ff] text-[10px] font-black uppercase tracking-widest italic">{selectedCert.issuer}</span>
                       <h4 className="text-white text-xs md:text-sm font-bold uppercase italic tracking-tighter">{selectedCert.title}</h4>
                    </div>
                    <button onClick={() => setSelectedCert(null)} className="text-red-500 hover:text-white transition-colors text-[10px] font-black uppercase flex items-center gap-2 border border-red-500/30 px-3 py-1 hover:bg-red-500">
                      ✕ TERMINATE
                    </button>
                  </div>

                  {/* Viewer Area */}
                  <div className="relative overflow-y-auto max-h-[70vh] bg-black">
                    {isPDF ? (
                      <PDFModalViewer url={assetUrl} />
                    ) : (
                      <div className="p-2 md:p-6 flex justify-center">
                        <img src={assetUrl} alt="Payload" className="w-full h-auto max-h-[65vh] object-contain shadow-2xl shadow-[#00f6ff]/5" />
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 bg-[#0b0f14] border-t border-white/5 flex justify-between items-center">
                    <span className="text-gray-600 text-[8px] uppercase font-bold hidden md:block tracking-widest">Authenticated_Credential_ID: {selectedCert._id}</span>
                    {selectedCert.credentialUrl && (
                      <a href={selectedCert.credentialUrl} target="_blank" className="bg-[#00f6ff] text-black px-6 py-2 text-[10px] font-black uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_15px_rgba(0,246,255,0.3)]">
                        Validate_Protocol
                      </a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </section>
  )
}