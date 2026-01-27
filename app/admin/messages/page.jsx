'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Eye, X, MessageSquare, Calendar, Clock, User, MailOpen, Mail } from 'lucide-react'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [viewMsg, setViewMsg] = useState(null)

  
  const fetchMessages = async () => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      if (data.success) {
        setMessages(data.data)
      }
    } catch (err) {
      console.error("Fetch failed:", err)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])


  const handleOpenMessage = async (msg) => {
    setViewMsg(msg)
    
    
    if (msg.status === 'new') {
      try {
        const token = localStorage.getItem('adminToken')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${msg._id}`, {
          method: 'PUT', 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          }
          
        })

        const result = await res.json()
        if (result.success) {
          
          setMessages(prev => 
            prev.map(m => m._id === msg._id ? { ...m, status: 'read' } : m)
          )
        }
      } catch (err) {
        console.error("Update failed:", err)
      }
    }
  }

 
  const deleteMsg = async (id) => {
    if (!confirm('PERMANENTLY_DELETE_TRANSMISSION?')) return
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) fetchMessages()
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6 font-mono text-white">
      {/* Header */}
      <div className="bg-[#0d121a] p-6 border border-white/5 shadow-2xl flex justify-between items-center rounded-sm">
        <div>
          <h1 className="text-xl font-black text-[#ff0055] uppercase italic tracking-[0.2em]">Inbound_Signals</h1>
          <p className="text-[9px] text-gray-500 uppercase mt-1">Intercepted_Nodes: {messages.length}</p>
        </div>
        <div className="text-[10px] bg-[#ff0055]/10 text-[#ff0055] px-4 py-1.5 border border-[#ff0055]/20 font-bold uppercase tracking-tighter">
          Unread_Intercepts: {messages.filter(m => m.status === 'new').length}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0d121a] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-white/5 text-[9px] uppercase text-gray-400 border-b border-white/5">
              <tr>
                <th className="p-4 w-16 text-center">Status</th>
                <th className="p-4">Origin_ID</th>
                <th className="p-4">Payload_Preview</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-center">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {messages.map((msg) => (
                <tr key={msg._id} className={`hover:bg-white/[0.02] transition-colors ${msg.status === 'new' ? 'bg-[#ff0055]/[0.03]' : ''}`}>
                  <td className="p-4 text-center">
                    {msg.status === 'read' ? 
                      <MailOpen size={14} className="text-gray-600 mx-auto" /> : 
                      <Mail size={14} className="text-[#ff0055] animate-pulse mx-auto" />
                    }
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${msg.status === 'new' ? 'border-[#ff0055]/40 bg-[#ff0055]/10' : 'border-white/10 bg-black'}`}>
                        <User size={14} className={msg.status === 'new' ? 'text-[#ff0055]' : 'text-gray-500'} />
                      </div>
                      <div>
                        <p className={`text-xs uppercase tracking-tighter ${msg.status === 'new' ? 'font-black text-white' : 'font-medium text-gray-400'}`}>{msg.name}</p>
                        <p className="text-[9px] text-gray-600 italic lowercase">{msg.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className={`text-[11px] max-w-[250px] truncate italic ${msg.status === 'new' ? 'text-gray-200' : 'text-gray-500'}`}>
                      "{msg.message}"
                    </p>
                  </td>
                  <td className="p-4 text-[9px] text-gray-500 uppercase font-bold tracking-widest">
                    {formatDate(msg.createdAt)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-4 text-gray-500">
                      <button onClick={() => handleOpenMessage(msg)} className="hover:text-[#00f6ff] transition-colors"><Eye size={16}/></button>
                      <button onClick={() => deleteMsg(msg._id)} className="hover:text-[#ff0055] transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {viewMsg && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0d121a] border border-[#ff0055]/30 p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(255,0,85,0.2)] rounded-sm"
            >
              <button onClick={() => setViewMsg(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
              <div className="flex items-center gap-2 text-[#ff0055] mb-6 font-black uppercase tracking-widest italic text-lg border-b border-white/5 pb-2">
                <MessageSquare size={20}/> Signal_Decrypted
              </div>
              <div className="space-y-6 mb-8 text-[11px] uppercase">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 mb-1 tracking-tighter italic">Sender_Node</p>
                    <p className="font-bold text-white text-xs">{viewMsg.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1 tracking-tighter italic">Return_Link</p>
                    <p className="font-bold text-[#00f6ff] lowercase">{viewMsg.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 mb-2 italic tracking-tighter">Decoded_Payload:</p>
                  <div className="text-xs text-gray-300 leading-relaxed bg-black/50 p-5 border border-white/5 italic rounded-sm border-l-2 border-[#ff0055]">
                    "{viewMsg.message}"
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-[9px] text-gray-600 font-black pt-4 border-t border-white/5 uppercase">
                <p className="flex items-center gap-1 text-[#ff0055]"><Clock size={10}/> {formatDate(viewMsg.createdAt)}</p>
                <p className="tracking-widest">Access_Level: ADMIN</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}