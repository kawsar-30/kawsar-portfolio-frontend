'use client'
import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'

export default function About() {
  const hackerElements = [
    "nmap -p- -sV 192.168.1.1", "L4_PENTEST_AUTHORIZED", 
    "CYBER_SECURITY_ANALYST", "CCNA_NETWORK_FLOW",
    "cat /etc/shadow", "gobuster dir -u", "nsda_auth_success"
  ]

  return (
    <section id="about" className="relative min-h-screen py-20 bg-[#0b0f14] flex items-center justify-center overflow-hidden">
      
      {/* Falling Hacker Text (Background) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
        {hackerElements.map((text, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: "-10vh", x: `${Math.random() * 95}vw` }}
            animate={{ opacity: [0, 1, 0], y: ["0vh", "110vh"] }}
            transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, ease: "linear", delay: index * 0.7 }}
            className="absolute text-[10px] text-[#00ff88] font-mono whitespace-nowrap"
          >
            {text}
          </motion.span>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 w-full">
        
        {/* Section Header */}
        <div className="mb-10 text-left">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-[#00f6ff] uppercase tracking-tighter italic"
          >
            ABOUT_ME
          </motion.h2>
          <div className="h-1.5 w-24 bg-[#ff0055] mt-3 shadow-[0_0_15px_#ff0055]"></div>
        </div>

        {/* macOS Terminal - Main Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full shadow-[0_50px_100px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden border border-white/10 bg-[#0d121a]/95 backdrop-blur-md"
        >
          {/* macOS Title Bar */}
          <div className="bg-[#1e2530] px-4 py-3 flex items-center justify-between border-b border-black/20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="text-[10px] text-gray-500 font-mono tracking-widest flex items-center gap-2">
              <Terminal size={12} /> kawsar@cyber-analyst: ~/bio.md
            </div>
            <div className="w-10"></div>
          </div>

          {/* Terminal Content - Pure Text Focus */}
          <div className="p-8 md:p-14 font-mono">
            
            {/* Command Input */}
            <div className="flex items-center gap-3 mb-10 text-sm md:text-base font-bold">
              <span className="text-[#00ff88]">➜</span>
              <span className="text-[#00f6ff]">~</span>
              <span className="text-white">cat profile.txt</span>
            </div>

            {/* Bio Information */}
            <div className="space-y-8">
              <h3 className="text-2xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                I am a <span className="text-[#00f6ff]">Cyber Security Analyst</span>
              </h3>

              <div className="space-y-6 text-sm md:text-xl text-[#d0d6e0] leading-relaxed max-w-3xl">
                <p>
                  Specializing in vulnerability research and offensive security operations. 
                  As a <span className="text-[#ff0055] font-black underline decoration-2 underline-offset-8 shadow-[0_0_20px_rgba(255,0,85,0.2)]">NSDA Level 4 Penetration Tester</span>, 
                  I am trained to identify and mitigate high-level security risks through systematic exploitation and analysis.
                </p>

                <p className="border-l-4 border-[#00f6ff]/30 pl-6 italic text-gray-400">
                  By leveraging my background in <span className="text-white font-bold border-b border-white/20">CCNA-level networking</span>, 
                  I analyze network traffic and architecture to preemptively defend against sophisticated cyber threats. 
                  My expertise includes Linux systems, web pentesting, and infrastructure hardening.
                </p>
              </div>
            </div>

            {/* Closing Cursor */}
            <div className="mt-16 flex items-center gap-3">
              <span className="text-[#00ff88] font-bold">➜</span>
              <span className="text-[#00f6ff]">~</span>
              <span className="inline-block w-2.5 h-6 bg-[#00ff88] animate-pulse"></span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}