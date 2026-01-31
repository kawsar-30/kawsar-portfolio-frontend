'use client'
import { useParams } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import Navbar from '@/components/common/Navbar'
import { fetchServices } from '@/redux/slices/serviceSlice'
import { motion } from 'framer-motion'

// PDF & Swiper imports
import { Document, Page, pdfjs } from 'react-pdf'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'; 
import 'swiper/css/navigation'; 
import 'swiper/css/pagination'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// PDF Worker setup
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PDFSlider = ({ url }) => {
  const [numPages, setNumPages] = useState(null)
  const [containerWidth, setContainerWidth] = useState(450)

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      // Responsive width setting
      setContainerWidth(width < 768 ? width - 40 : 480);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div className="w-full bg-[#0d121a] rounded-xl border border-[#00f6ff]/20 p-2 shadow-2xl overflow-hidden">
      <Document 
        file={url} 
        onLoadSuccess={({ numPages }) => setNumPages(numPages)} 
        className="flex flex-col items-center"
        loading={<div className="text-[#00f6ff] font-mono animate-pulse p-10 uppercase">Decrypting_Secure_PDF...</div>}
      >
        <Swiper 
          modules={[Navigation, Pagination]} 
          navigation 
          pagination={{ type: 'fraction' }} 
          className="w-full"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <SwiperSlide key={index} className="flex justify-center bg-[#0b0f14] py-4">
              <Page 
                pageNumber={index + 1} 
                renderTextLayer={false} 
                renderAnnotationLayer={false} 
                width={containerWidth}
                className="shadow-2xl shadow-black"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Document>
    </div>
  )
}

export default function DetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  
  // Redux logic to fetch both Services and Certificates
  const { items: services, status } = useSelector((state) => state.services)
  const { items: certs } = useSelector((state) => state.certificates || { items: [] })

  // Find data from either collection
  const data = services.find(s => s._id === id) || certs.find(c => c._id === id);

  useEffect(() => {
    if (services.length === 0 && status === 'idle') dispatch(fetchServices())
  }, [services, status, dispatch])

  if (!data) return (
    <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center text-[#00f6ff] font-mono italic tracking-widest">
      STABLIZING_CONNECTION_0x71...
    </div>
  )

  // --- 🔥 LOGIC TO FIX THE DATABASE TYPE ERROR ---
  const mediaObj = Array.isArray(data.media) ? data.media[0] : data.media;
  const assetUrl = data.assetUrl || mediaObj?.url;
  
  // Eikhane logic updated: Jodi mediaType image-o thake kintu url-e .pdf thake, tobeo slider-e jabe
  const isPDF = assetUrl?.toLowerCase().includes('.pdf') || 
                mediaObj?.originalName?.toLowerCase().endsWith('.pdf') ||
                mediaObj?.mediaType === 'pdf';

  return (
    <>
      <Navbar />
      <div className="h-20 bg-[#0b0f14]"></div>
      
      <main className="min-h-screen bg-[#0b0f14] text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            
            {/* Left Column: PDF Slider or Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full md:w-5/12 sticky top-28"
            >
              {isPDF ? (
                <PDFSlider url={assetUrl} />
              ) : assetUrl ? (
                <div className="relative group rounded-2xl overflow-hidden border border-[#00f6ff]/20 shadow-[0_0_40px_rgba(0,246,255,0.05)]">
                  <img src={assetUrl} className="w-full h-auto" alt="Module Visual" />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border border-dashed border-[#00f6ff]/20 rounded-2xl text-gray-600 font-mono italic uppercase">
                  No_Asset_Loaded
                </div>
              )}
            </motion.div>

            {/* Right Column: Information */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-7/12"
            >
              <div className="mb-4">
                <span className="text-[#00ff88] text-[10px] font-mono tracking-[0.4em] uppercase border-l-2 border-[#00ff88] pl-3">
                  {data.issuer || data.category || 'SEC_CLASSIFIED'}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight text-white uppercase italic tracking-tighter">
                {(data.title || "").replace(/ /g, '_')}
              </h1>

              <div className="space-y-8">
                <div className="relative p-6 bg-white/[0.02] border-l-2 border-[#00f6ff] rounded-r-lg">
                  <h3 className="text-[#00f6ff] font-mono text-xs uppercase tracking-widest font-bold mb-4 opacity-70">
                    // Operational_Summary
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed font-sans whitespace-pre-wrap">
                    {data.description || "Detailed audit logs and documentation available for this module."}
                  </p>
                </div>

                {/* Cyber Action Buttons */}
                <div className="flex gap-4">
                  {data.credentialUrl && (
                    <a 
                      href={data.credentialUrl}
                      target="_blank"
                      className="px-6 py-3 bg-[#00f6ff] text-black font-mono text-[10px] font-bold hover:bg-white transition-all duration-300 tracking-[0.2em] uppercase"
                    >
                      Verify_Cloud_Asset
                    </a>
                  )}
                  <button className="px-6 py-3 border border-white/10 text-white font-mono text-[10px] hover:bg-white/5 transition-all duration-300 uppercase">
                    Initialize_Download
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </>
  )
}