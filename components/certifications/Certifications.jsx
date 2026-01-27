'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCertifications } from '@/redux/slices/certificationSlice'

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
    <section id="certifications" className="py-24 bg-[#0b0f14] relative font-mono">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black text-[#00f6ff] uppercase tracking-widest"
          >
            Certifications_
          </motion.h2>
          
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            transition={{ duration: 0.8 }}
            className="h-1.5 bg-[#00ff88] mt-2 shadow-[0_0_15px_#00ff88]"
          />
          
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-4 opacity-60">
            Verified_Cyber_Credentials
          </p>
        </div>

        {/* Dynamic List Layout */}
        <div className="space-y-3">
          {certificationsData && certificationsData.map((cert, index) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCert(cert)}
              className="group relative flex items-center justify-between p-4 border border-white/5 hover:border-[#00f6ff]/30 bg-white/[0.01] hover:bg-[#00f6ff]/5 transition-all cursor-pointer rounded-sm"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-700 text-[10px] font-bold">
                  {index < 9 ? `0${index + 1}` : index + 1}
                </span>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-white group-hover:text-[#00f6ff] transition-colors uppercase tracking-tight">
                    {cert.title}
                  </h3>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">
                    {cert.issuer}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-[9px] text-gray-600 font-bold">
                  {formatDate(cert.issueDate)}
                </span>
                <span className="text-[#00f6ff] group-hover:rotate-90 transition-transform font-bold">
                  [+]
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for viewing Certificate Image */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
              onClick={() => setSelectedCert(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="absolute -top-12 right-0 text-red-500 font-bold text-xl hover:scale-125 transition-transform"
                >
                  ✕ CLOSE_MODULE
                </button>

                <div className="relative border border-white/10 bg-black shadow-2xl">
                  {/* media[0].url ব্যবহার করা হয়েছে স্কিমা অনুযায়ী */}
                  <img 
                    src={selectedCert.media?.[0]?.url || 'https://via.placeholder.com/1200x800?text=No+Image'} 
                    alt={selectedCert.title}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[#00f6ff] text-xs font-bold uppercase tracking-widest">
                    {selectedCert.title}
                  </span>
                  {selectedCert.credentialUrl && (
                    <a 
                      href={selectedCert.credentialUrl} 
                      target="_blank" 
                      className="text-[#00ff88] text-[10px] border border-[#00ff88]/30 px-3 py-1 hover:bg-[#00ff88]/10 transition-all"
                    >
                      VERIFY_LINK
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}