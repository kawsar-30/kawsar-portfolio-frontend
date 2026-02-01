'use client'
import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function PDFSliderComponent({ url }) {
  const [numPages, setNumPages] = useState(null)
  const [containerWidth, setContainerWidth] = useState(800)

  useEffect(() => {
    const updateWidth = () => {
      const w = window.innerWidth
      setContainerWidth(w < 768 ? w - 40 : 800)
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  return (
    <div className="w-full bg-[#0d121a] rounded-lg border border-[#00f6ff]/20 p-2 overflow-hidden">
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        className="flex justify-center"
      >
        <Swiper modules={[Navigation, Pagination]} navigation pagination={{ type: 'fraction' }} className="w-full">
          {Array.from(new Array(numPages), (_, index) => (
            <SwiperSlide key={index} className="flex justify-center bg-[#0b0f14] py-4">
              <Page pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false} width={containerWidth} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Document>
    </div>
  )
}