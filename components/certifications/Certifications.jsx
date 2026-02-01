'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCertifications } from '@/redux/slices/certificationSlice'
import dynamic from 'next/dynamic'

// PDF Viewer-ke dynamic kora holo jate build error na hoy
const PDFModalViewer = dynamic(() => import('../PDFSliderComponent'), { 
  ssr: false 
});

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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,246,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,246,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black text-[#00f6ff] uppercase tracking-widest italic"
          >
            Certifications
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            transition={{ duration: 0.8 }}
            className="h-1.5 bg-[#00ff88] mt-2 shadow-[0_0_15px_#00ff88]"
          />
        </div>

        <div className="space-y-4">
          {certificationsData && certificationsData.map((cert, index) => (
            <motion.div
              key={cert._id}
              onClick={() => setSelectedCert(cert)}
              className="group relative flex items-center justify-between p-5 border border-white/5 hover:border-[#00f6ff]/40 bg-white/[0.01] hover:bg-[#00f6ff]/5 transition-all cursor-pointer rounded-lg"
            >
              <div className="flex items-center gap-6">
                <span className="text-gray-700 font-black text-[10px] italic">{index + 1}</span>
                <div>
                  <h3 className="text-sm md:text-lg font-bold text-white uppercase italic">{cert.title}</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">{cert.issuer}</p>
                </div>
              </div>
              <span className="text-[#00f6ff] font-bold">[+]</span>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedCert && (() => {
            const assetUrl = selectedCert.media?.[0]?.url;
            const isPDF = assetUrl?.toLowerCase().includes('.pdf');
            return (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] flex items-center justify-center p-3 bg-black/90 backdrop-blur-xl"
                onClick={() => setSelectedCert(null)}
              >
                <motion.div className="relative max-w-5xl w-full bg-[#0d121a] border border-[#00f6ff]/20" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center p-4 border-b border-white/5">
                    <h4 className="text-white text-xs font-bold uppercase">{selectedCert.title}</h4>
                    <button onClick={() => setSelectedCert(null)} className="text-red-500 font-black px-3 py-1 border border-red-500/30">✕ TERMINATE</button>
                  </div>
                  <div className="relative overflow-y-auto max-h-[70vh] bg-black">
                    {isPDF ? <PDFModalViewer url={assetUrl} /> : <img src={assetUrl} className="w-full h-auto object-contain" />}
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