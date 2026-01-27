'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Briefcase, 
  Award, 
  Cpu, 
  Mail, 
  LogOut, 
  AlertTriangle 
} from 'lucide-react'

export default function AdminLayout({ children }) {
  const [authorized, setAuthorized] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false) 
  const router = useRouter()
  const pathname = usePathname()


  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login')
    } else {
      setAuthorized(true)
    }
  }, [pathname, router])


  const fetchUnreadCount = async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        const unread = data.data.filter(msg => msg.status === 'new').length
        setUnreadCount(unread)
      }
    } catch (err) { console.error("Notification Error:", err) }
  }

  useEffect(() => {
    if (authorized) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 60000) 
      return () => clearInterval(interval)
    }
  }, [authorized, pathname])

  
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/admin/login'
  }

  if (pathname === '/admin/login') return <>{children}</>
  if (!authorized) return <div className="bg-[#0b0f14] min-h-screen"></div>

  
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Admins', path: '/admin/users', icon: <Users size={18} /> },
    { name: 'Visitor', path: '/admin/visitors', icon: <Users size={18} /> },
    { name: 'Services', path: '/admin/services', icon: <Settings size={18} /> },
    { name: 'Projects', path: '/admin/projects', icon: <Briefcase size={18} /> },
    { name: 'Certificates', path: '/admin/certifications', icon: <Award size={18} /> },
    { name: 'Skills', path: '/admin/skills', icon: <Cpu size={18} /> },
    { name: 'Messages', path: '/admin/messages', icon: <Mail size={18} /> },
  ]

  return (
    <div className="flex min-h-screen bg-[#0b0f14] font-mono text-gray-300">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-[#0d121a] flex flex-col z-50 shadow-2xl">
        <div className="p-6 border-b border-white/5 font-black text-[#00f6ff] text-xl italic uppercase tracking-tighter flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00f6ff] rounded-full animate-pulse"></div>
          CYBER_ROOT
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={`flex items-center justify-between p-3 rounded-sm transition-all relative group ${
                pathname === item.path 
                ? 'bg-[#00f6ff]/10 text-[#00f6ff] border-l-2 border-[#00f6ff]' 
                : 'hover:bg-white/5 text-gray-500 hover:text-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={pathname === item.path ? 'text-[#00f6ff]' : 'text-gray-500 group-hover:text-gray-300'}>
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.name}</span>
                </div>

                {item.name === 'Messages' && unreadCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="bg-[#ff0055] text-white text-[8px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,0,85,0.4)]"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="p-6 text-left text-red-500/70 hover:text-red-500 text-[10px] uppercase tracking-[0.2em] font-black hover:bg-red-500/5 transition-all border-t border-white/5 italic flex items-center gap-3 group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          Terminate_Session
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        <header className="h-16 border-b border-white/5 bg-[#0d121a]/60 flex items-center justify-between px-8 sticky top-0 backdrop-blur-xl z-40">
          <div className="text-[9px] text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2 font-bold">
            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
            Node_Status: <span className="text-[#00ff88]">System_Online</span>
          </div>
          <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest border border-white/5 px-3 py-1 bg-white/5">
            Admin_Access // {new Date().toLocaleDateString()}
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0d121a] border border-red-500/20 p-8 max-w-sm w-full shadow-[0_0_50px_rgba(255,0,85,0.15)] rounded-sm text-center"
            >
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <h2 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-3 text-red-500">Warning: Session_Exit</h2>
              <p className="text-gray-500 text-[10px] uppercase mb-8 leading-relaxed tracking-wider">
                Are you sure you want to terminate the secure administrative connection?
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 border border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 bg-red-600/10 border border-red-500/50 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white shadow-[0_0_20px_rgba(255,0,0,0.2)] transition-all"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}