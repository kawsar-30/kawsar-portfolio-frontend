'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Monitor, Clock, Activity, X, Globe, Terminal, ChevronRight } from 'lucide-react'

export default function VisitorAnalytics() {
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)

  const fetchVisitors = async () => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visitors`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      if (data.success) setVisitors(data.data)
    } catch (err) {
      console.error("Fetch failed:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVisitors() }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-[#00f6ff] font-mono animate-pulse uppercase tracking-[0.5em]">
      Scanning_Network_Nodes...
    </div>
  )

  return (
    <div className="space-y-6 font-mono text-white uppercase overflow-hidden">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0d121a] p-6 border border-white/5 border-l-[#00f6ff] border-l-4 shadow-xl">
          <p className="text-gray-500 text-[10px] tracking-[0.2em]">Unique_Nodes</p>
          <h2 className="text-3xl font-black text-white mt-2">{visitors.length}</h2>
        </div>
        <div className="bg-[#0d121a] p-6 border border-white/5 border-l-[#ff0055] border-l-4 shadow-xl">
          <p className="text-gray-500 text-[10px] tracking-[0.2em]">Total_Transmissions</p>
          <h2 className="text-3xl font-black text-white mt-2">
            {visitors.reduce((acc, curr) => acc + (curr.visits || 0), 0)}
          </h2>
        </div>
        <div className="bg-[#0d121a] p-6 border border-white/5 border-l-[#00ff88] border-l-4 shadow-xl">
          <p className="text-gray-500 text-[10px] tracking-[0.2em]">Monitoring_Status</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
            <h2 className="text-sm font-black text-[#00ff88]">System_Live</h2>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0d121a] border border-white/5 rounded-sm overflow-hidden">
        <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-[11px] font-black tracking-widest flex items-center gap-2 italic text-[#00f6ff]">
            <Terminal size={14} className="text-[#ff0055]"/> Raw_Traffic_Signals
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-[9px] text-gray-500 font-black">
              <tr>
                <th className="p-4">IP_Identity</th>
                <th className="p-4 text-center">Hits</th>
                <th className="p-4">Recent_Path</th>
                <th className="p-4">Last_Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visitors.map((v) => (
                <tr 
                  key={v._id} 
                  onClick={() => setSelectedUser(v)}
                  className="hover:bg-[#00f6ff]/[0.05] cursor-pointer text-[10px] transition-all group"
                >
                  <td className="p-4 font-bold text-[#00f6ff]">{v.ip || '0.0.0.0'}</td>
                  <td className="p-4 text-center">
                    <span className="bg-[#ff0055]/10 text-[#ff0055] px-2 py-0.5 border border-[#ff0055]/20 font-black">
                      {v.visits || 1}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 italic">
                    {v.visitedPaths?.[v.visitedPaths.length - 1]?.path || v.path || '/root'}
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(v.lastVisited || v.updatedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDE MODAL - USER JOURNEY TIMELINE */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="relative w-full max-w-lg bg-[#0d121a] border-l border-[#00f6ff]/30 h-screen flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,1)]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <div>
                  <h4 className="text-[#00f6ff] text-xl font-black italic tracking-tighter">NODE_JOURNEY</h4>
                  <p className="text-[9px] text-gray-500 tracking-[0.4em] mt-1">{selectedUser.ip}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
                  <X size={24}/>
                </button>
              </div>

              {/* Scrollable Timeline */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                {/* Device Info */}
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-sm">
                  <p className="text-[8px] text-gray-500 tracking-widest mb-2">SYSTEM_ENVIRONMENT</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-light lowercase italic break-all">
                    {selectedUser.userAgent}
                  </p>
                </div>

                {/* Vertical Timeline */}
                <div className="relative border-l-2 border-dashed border-white/10 ml-4 pl-8 space-y-8">
                  <h5 className="text-[#ff0055] text-[10px] font-black tracking-[0.3em] mb-4 uppercase">Transmission_Log:</h5>
                  
                  {selectedUser.visitedPaths && selectedUser.visitedPaths.length > 0 ? (
                    [...selectedUser.visitedPaths].reverse().map((step, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="relative"
                      >
                        {/* Status Node */}
                        <div className="absolute -left-[41px] top-1 w-5 h-5 bg-[#0d121a] border-2 border-[#00f6ff] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,246,255,0.3)]">
                          <div className="w-1.5 h-1.5 bg-[#00f6ff] rounded-full"></div>
                        </div>

                        <div className="bg-[#141b26] p-5 border border-white/5 rounded-sm hover:border-[#00f6ff]/40 transition-all shadow-lg">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[9px] text-[#00f6ff] font-black bg-[#00f6ff]/10 px-2 py-0.5 border border-[#00f6ff]/20">
                              STEP_{selectedUser.visitedPaths.length - i}
                            </span>
                            <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">
                              {new Date(step.timestamp || Date.now()).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <ChevronRight size={14} className="text-[#ff0055]" />
                            <p className="text-white font-bold text-[12px] tracking-wider break-all lowercase">
                              {step.path}
                            </p>
                          </div>
                          
                          <p className="text-[9px] text-gray-600 mt-4 font-black">
                            {new Date(step.timestamp || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-gray-600 text-[10px] italic">NO_LOG_DATA_FOUND_FOR_THIS_NODE</div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-black/40 text-center">
                <p className="text-[8px] text-gray-700 tracking-[0.6em] font-black uppercase">Secure_Session_End</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}