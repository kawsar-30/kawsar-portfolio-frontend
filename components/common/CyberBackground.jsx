'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function CyberBackground() {
  const [mounted, setMounted] = useState(false)
  const [elements, setElements] = useState([])

  const hackerCommands = [
    "nmap -A -T4 10.0.0.1", "sqlmap --dbs", "msfconsole", "gobuster dir -u", 
    "burpsuite", "hydra -l admin -P pass.txt", "exploit(multi/handler)", 
    "whoami", "cat /etc/passwd", "nc -lvnp 4444", "chmod +x shell.sh",
    "john --wordlist=rockyou.txt", "airmon-ng start wlan0", "wireshark",
    "GET /index.php?id=1' OR '1'='1", "shred -u secret.txt", "setoolkit"
  ]

  useEffect(() => {
    
    const generated = hackerCommands.map(text => ({
      text,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 5
    }))
    setElements(generated)
    setMounted(true)
  }, [])

  
  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#0b0f14] overflow-hidden">
      {elements.map((el, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: `${el.x}vw`, y: `${el.y}vh` }}
          animate={{ 
            opacity: [0, 0.15, 0],
            y: [`${el.y}vh`, `${(el.y + 20) % 100}vh`]
          }}
          transition={{ 
            duration: el.duration, 
            repeat: Infinity, 
            ease: "linear",
            delay: el.delay
          }}
          className="absolute text-[9px] md:text-xs text-[#00ff88] font-mono tracking-widest whitespace-nowrap opacity-20"
        >
          {el.text}
        </motion.span>
      ))}

      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00f6ff05] blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00ff8805] blur-[150px] rounded-full"></div>
    </div>
  )
}