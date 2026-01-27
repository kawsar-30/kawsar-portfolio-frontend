'use client'
import { useSelector } from 'react-redux'
import Navbar from '@/components/common/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AllServices() {
  const { items } = useSelector((state) => state.services);

  return (
    <main className="min-h-screen bg-[#0b0f14] pt-24 pb-20">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <Link href="/" className="text-gray-500 hover:text-[#00f6ff] text-xs font-mono uppercase tracking-widest">
            &lt; Back_to_Terminal
          </Link>
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic mt-6">All_Services.sys</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items?.map((service) => (
            <Link href={`/services/${service._id}`} key={service._id} className="block bg-[#0d121a] border border-white/5 p-6 hover:border-[#00f6ff]/50 transition-all shadow-xl">
               <h3 className="text-xl font-bold text-[#00f6ff] mb-4 uppercase">{service.title}</h3>
               <p className="text-gray-400 text-sm font-mono mb-4 line-clamp-3">{service.description}</p>
               <span className="text-[10px] text-[#00ff88] tracking-widest border border-[#00ff88]/30 px-2 py-1 uppercase">{service.category}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}