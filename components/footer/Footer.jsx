'use client'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socials = [
    { icon: <FaGithub />, name: "GitHub", link: "https://github.com/kawsar-30" },
    { icon: <FaLinkedinIn />, name: "LinkedIn", link: "https://linkedin.com/in/kawsarhossain30" },
    { icon: <FaWhatsapp />, name: "WhatsApp", link: "https://wa.me/01629333638" },
  ];

  return (
    <footer className="relative bg-[#0b0f14] py-12 md:py-16 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* --- Social Icons Row (3 Icons Only) --- */}
        <div className="flex justify-center gap-8 md:gap-12 mb-10">
          {socials.map((social, index) => (
            <motion.a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center group gap-3"
            >
              {/* Circle Icon Container */}
              <div className="w-14 h-14 md:w-16 md:h-16 border border-[#00f6ff]/20 rounded-full flex items-center justify-center text-white/60 group-hover:text-[#00ff88] group-hover:border-[#00ff88] group-hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] transition-all duration-500 relative bg-[#0d121a]">
                 <span className="text-2xl md:text-3xl">{social.icon}</span>
              </div>
              
              {/* Label below icon */}
              <span className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                {social.name}
              </span>
            </motion.a>
          ))}
        </div>

        {/* --- Center Tagline --- */}
        <div className="mb-8">
          <p className="text-[#00f6ff] text-[10px] md:text-xs font-bold tracking-[0.6em] uppercase opacity-60">
            SECURE_COMMUNICATION_ESTABLISHED
          </p>
        </div>

        {/* --- Copyright Bar --- */}
        <div className="w-full border-t border-white/5 pt-8 flex flex-col items-center gap-4">
          <div className="flex items-center flex-wrap justify-center gap-2 text-gray-400 font-mono text-[10px] md:text-xs uppercase tracking-wider text-center px-4">
            <span className="text-[#00ff88]">©</span>
            <span>{currentYear} MD. KAWSAR HOSSAIN</span>
            <span className="hidden sm:inline">|</span>
            <span className="block sm:inline">ALL RIGHTS RESERVED</span>
          </div>
          
          {/* Terminal Scanning Line */}
          <div className="w-24 h-[1px] bg-gray-800 relative overflow-hidden">
            <motion.div 
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="w-1/2 h-full bg-[#00ff88]/40"
            />
          </div>
        </div>

      </div>
    </footer>
  )
}