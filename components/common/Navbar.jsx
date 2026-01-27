'use client'
import { useState, useEffect } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home')
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const sectionIds = ['home', 'about', 'services', 'skills', 'projects', 'certifications', 'contact'];

  useEffect(() => {
    setMounted(true)
    if (!isHomePage) return;

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  const navItems = [
    { name: 'Home', to: 'home' },
    { name: 'About', to: 'about' },
    { name: 'Services', to: 'services' },
    { name: 'Skills', to: 'skills' },
    { name: 'Projects', to: 'projects' },
    { name: 'Certifications', to: 'certifications' },
    { name: 'Contact', to: 'contact' },
  ]

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 w-full z-[100] bg-[#0b0f14]/90 backdrop-blur-md border-b border-[#00f6ff]/20 font-mono">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5 flex justify-between items-center">
        
        {isHomePage ? (
          <ScrollLink to="home" smooth={true} duration={500} className="cursor-pointer">
            <h1 className="text-[#00f6ff] font-black text-lg md:text-2xl tracking-tighter drop-shadow-[0_0_10px_rgba(0,246,255,0.5)] uppercase">
              MD. KAWSAR HOSSAIN
            </h1>
          </ScrollLink>
        ) : (
          <Link href="/">
            <h1 className="text-[#00f6ff] font-black text-lg md:text-2xl tracking-tighter drop-shadow-[0_0_10px_rgba(0,246,255,0.5)] uppercase">
              MD. KAWSAR HOSSAIN
            </h1>
          </Link>
        )}

        <div className="hidden md:flex space-x-6 lg:space-x-8 text-gray-300">
          {navItems.map((item) => (
            <div key={item.to} className="relative py-1">
              {isHomePage ? (
                <ScrollLink
                  to={item.to}
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  className={`cursor-pointer text-[10px] lg:text-[13px] font-bold uppercase tracking-[0.1em] transition-all duration-300 hover:text-[#00f6ff] ${
                    activeSection === item.to ? 'text-[#00f6ff]' : 'text-gray-400'
                  }`}
                >
                  {item.name}
                </ScrollLink>
              ) : (
                <Link
                  href={`/#${item.to}`}
                  className="cursor-pointer text-[10px] lg:text-[13px] font-bold uppercase tracking-[0.1em] transition-all hover:text-[#00f6ff] text-gray-400"
                >
                  {item.name}
                </Link>
              )}

              {isHomePage && activeSection === item.to && (
                <motion.div 
                  layoutId="navbar-underline" 
                  className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#00f6ff] shadow-[0_0_15px_#00f6ff]"
                />
              )}
            </div>
          ))}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-[#00f6ff] p-2">
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0b0f14] border-b border-[#00f6ff]/30 overflow-hidden"
          >
            <div className="flex flex-col space-y-6 px-10 py-10">
              {navItems.map((item, idx) => (
                isHomePage ? (
                  <ScrollLink
                    key={item.to}
                    to={item.to}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    onClick={() => setIsOpen(false)}
                    className={`text-[14px] font-black uppercase tracking-[0.2em] flex items-center ${
                      activeSection === item.to ? 'text-[#00ff88]' : 'text-gray-400'
                    }`}
                  >
                    <span className="mr-4 text-[#00f6ff] text-[10px] opacity-50">0{idx + 1}</span>
                    {item.name}
                  </ScrollLink>
                ) : (
                  <Link
                    key={item.to}
                    href={`/#${item.to}`}
                    onClick={() => setIsOpen(false)}
                    className="text-[14px] font-black uppercase tracking-[0.2em] flex items-center text-gray-400"
                  >
                    <span className="mr-4 text-[#00f6ff] text-[10px] opacity-50">0{idx + 1}</span>
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}