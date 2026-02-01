'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import profilePic from '../../public/assets/profile.png'

export default function Hero() {
  const [line1, setLine1] = useState('') 
  const [line2, setLine2] = useState('') 
  const [line3, setLine3] = useState('') 
  const [line4, setLine4] = useState('') 
  const [step, setStep] = useState(0)

  const [currentRoleText, setCurrentRoleText] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const roles = ['Penetration Tester', 'Cyber Security Analyst','Vulnerability Assessment']

  const text1 = "> WHOAMI_"
  const text2 = "MD."
  const text3 = "KAWSAR"
  const text4 = "HOSSAIN"

  const hackerElements = [
    "nmap -A -T4 10.0.0.1", "sqlmap --dbs", "msfconsole", "gobuster dir -u", 
    "burpsuite", "hydra -l admin -P pass.txt", "exploit(multi/handler)", 
    "whoami", "cat /etc/passwd", "nc -lvnp 4444", "chmod +x shell.sh",
    "john --wordlist=rockyou.txt", "airmon-ng start wlan0", "wireshark",
    "GET /index.php?id=1' OR '1'='1", "shred -u secret.txt", "setoolkit"
  ]

  useEffect(() => {
    if (step < 4) {
      const texts = [text1, text2, text3, text4]
      const setters = [setLine1, setLine2, setLine3, setLine4]
      let i = 0
      const timer = setInterval(() => {
        setters[step](texts[step].slice(0, i + 1))
        i++
        if (i === texts[step].length) {
          clearInterval(timer)
          setTimeout(() => setStep(step + 1), 200)
        }
      }, 80)
      return () => clearInterval(timer)
    }
  }, [step])

  useEffect(() => {
    if (step === 4) {
      const speed = isDeleting ? 50 : 150; 
      const timeout = setTimeout(() => {
        const currentFullText = roles[roleIndex];
        if (!isDeleting) {
          const nextText = currentFullText.slice(0, currentRoleText.length + 1);
          setCurrentRoleText(nextText);
          if (nextText === currentFullText) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          const nextText = currentFullText.slice(0, currentRoleText.length - 1);
          setCurrentRoleText(nextText);
          if (nextText === '') {
            setIsDeleting(false);
            setRoleIndex((prev) => (prev + 1) % roles.length);
          }
        }
      }, speed); 
      return () => clearTimeout(timeout);
    }
  }, [currentRoleText, isDeleting, roleIndex, step]);

  return (
    <section id='home' className="relative min-h-screen w-full flex items-center justify-center px-4 md:px-6 py-10 bg-[#0b0f14] overflow-hidden">
      
      {/* --- Cyber Background --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {hackerElements.map((text, index) => {
          const leftPosition = Math.random() * 90;
          return (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: "-10vh", x: `${leftPosition}vw` }}
              animate={{ 
                opacity: [0, 0.2, 0], 
                y: ["0vh", "110vh"],   
              }}
              transition={{ 
                duration: 6 + Math.random() * 4, 
                repeat: Infinity, 
                ease: "linear",
                delay: index * 0.5 
              }}
              className="absolute text-[8px] md:text-xs text-[#00ff88] font-mono tracking-[0.2em] whitespace-nowrap select-none border-l border-[#00ff8820] pl-1"
            >
              {text}
            </motion.span>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff8803] to-transparent"></div>
      </div>

      {/* --- Main Layout Container --- */}
      <div className="relative z-10 max-w-6xl w-full flex flex-col-reverse md:flex-row items-center justify-between gap-y-12 md:gap-x-8">
        
        {/* Left: Content */}
        <div className="w-full md:w-3/5 flex flex-col space-y-3 md:space-y-5 text-left">
          <div className="text-[#00f6ff] text-xs md:text-lg font-bold tracking-[0.3em] min-h-[20px] drop-shadow-[0_0_8px_rgba(0,246,255,0.4)]">
            {line1}{step === 0 && <span className="animate-pulse">_</span>}
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.85] uppercase tracking-tighter text-white">
            <span className="block">{line2}{step === 1 && <span className="text-[#00f6ff]">|</span>}</span>
            <span className="block">{line3}{step === 2 && <span className="text-[#00f6ff]">|</span>}</span>
            <span className="text-[#00f6ff] block drop-shadow-[0_0_12px_rgba(0,246,255,0.3)]">
              {line4}{step === 3 && <span>|</span>}
            </span>
          </h1>

          {step === 4 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
               <div className="flex items-center flex-wrap gap-2 text-base sm:text-xl md:text-2xl font-bold mt-2">
                 <span className="shrink-0 text-[#d0d6e0] opacity-80 font-normal text-xs md:text-lg italic">root@kawsar:~#</span>
                 <span className="text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,0.4)]">{currentRoleText}</span>
                 <span className="w-2 md:w-2.5 h-5 md:h-6 bg-[#00ff88] animate-pulse"></span>
               </div>

               <p className="text-gray-400 max-w-md text-[10px] md:text-xs border-l-2 border-[#00f6ff]/40 pl-4 py-1 uppercase tracking-widest leading-relaxed">
                 Certified Ethical Hacker | Penetration Tester | Network Security
               </p>

               <div className="flex flex-row gap-3 md:gap-4 pt-2">
                  {/* Resume Button - Google Drive Link */}
                  <a 
                    href="https://drive.google.com/file/d/1gLAqI9pst88Kiy5n-iQG2HzPPTfPXrKP/view?usp=drive_link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <button className="border border-[#00f6ff] text-[#00f6ff] px-5 md:px-8 py-2 md:py-2.5 rounded-none font-bold text-[10px] md:text-sm hover:bg-[#00f6ff] hover:text-[#0b0f14] transition-all bg-[#0b0f14]/50">
                      ⬇ RESUME
                    </button>
                  </a>
                  
                  {/* Contact Button - Scrolls to #contact section */}
                  <a href="#contact">
                    <button className="border border-[#00ff88] text-[#00ff88] px-5 md:px-8 py-2 md:py-2.5 rounded-none font-bold text-[10px] md:text-sm hover:bg-[#00ff88] hover:text-[#0b0f14] transition-all bg-[#0b0f14]/50">
                      ✉ CONTACT
                    </button>
                  </a>
               </div>
            </motion.div>
          )}
        </div>

        {/* Right: Profile Image */}
        <div className="w-full md:w-auto flex justify-center relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[380px] lg:h-[380px]"
          >
            {/* Outer Glows */}
            <div className="absolute inset-0 bg-[#00ff8808] blur-[80px] rounded-full"></div>
            <div className="absolute -inset-2 md:-inset-4 border border-[#00f6ff15] rounded-full animate-[spin_30s_linear_infinite] border-dashed"></div>

            {/* Image Wrapper */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 md:border-4 border-[#00ff8830] z-10 bg-[#0b0f14]">
              <Image 
                src={profilePic} 
                alt="MD KAWSAR HOSSAIN" 
                fill 
                className="object-cover"
                priority 
              />
            </div>

            {/* Badges */}
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-[#0b0f14] border border-[#00f6ff] px-2 py-0.5 text-[7px] md:text-[10px] text-[#00f6ff] z-20 font-bold shadow-[0_0_10px_rgba(0,246,255,0.3)]">
              SECURED
            </div>
            <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 bg-[#0b0f14] border border-[#00ff88] px-2 py-0.5 text-[7px] md:text-[10px] text-[#00ff88] z-20 font-bold shadow-[0_0_10px_rgba(0,255,136,0.3)]">
              ACTIVE
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}