'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Shield, Trash2, Key, X, AlertCircle } from 'lucide-react'

export default function AdminManagement() {
  const [admins, setAdmins] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const fetchAdmins = async () => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admins`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setAdmins(data.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchAdmins() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      })
      if (res.ok) { setShowCreateModal(false); fetchAdmins(); }
    } catch (err) { alert("Registration failed") }
  }

  const handleDelete = async (id) => {
    if (!confirm("TERMINATE_NODE: Are you sure?")) return
    const token = localStorage.getItem('adminToken')
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admins/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchAdmins()
    } catch (err) { console.error(err) }
  }

  const handleResetPassword = async (id) => {
    const newPass = prompt("ENTER_NEW_ENCRYPTION_KEY (New Password):")
    if (!newPass) return
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admins/reset/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ newPassword: newPass })
      })
      if (res.ok) alert("CIPHER_UPDATED: Password changed successfully.")
    } catch (err) { console.error(err) }
  }

  return (
    <div className="space-y-8 font-mono">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white italic uppercase tracking-widest">Access_Control</h1>
          <p className="text-[10px] text-gray-500 tracking-[0.3em] mt-1 italic">Authorized_Personnel_Registry</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-[#00f6ff]/10 border border-[#00f6ff]/30 text-[#00f6ff] px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#00f6ff] hover:text-black transition-all">
          <UserPlus size={14} /> New_Admin_Unit
        </button>
      </div>

      <div className="bg-[#0d121a] border border-white/5 rounded-sm">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-white/5 text-gray-500 uppercase font-black">
            <tr>
              <th className="p-4">Identity</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {admins.map((admin) => (
              <tr key={admin._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4 font-bold text-[#00f6ff] flex items-center gap-3">
                  <Shield size={12} className="text-[#00ff88]" /> {admin.name}
                </td>
                <td className="p-4 text-gray-400 font-medium lowercase tracking-wider">{admin.email}</td>
                <td className="p-4 text-right space-x-4">
                  <button onClick={() => handleResetPassword(admin._id)} className="text-gray-500 hover:text-[#00f6ff] transition-all"><Key size={14} /></button>
                  <button onClick={() => handleDelete(admin._id)} className="text-gray-500 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#0d121a] border border-[#00f6ff]/20 p-8 max-w-md w-full relative shadow-2xl">
               <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
               <h3 className="text-[#00f6ff] text-sm font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2 italic">
                 <AlertCircle size={16}/> Initializing_New_Authority
               </h3>
               <form onSubmit={handleCreate} className="space-y-4">
                 <input placeholder="NAME" required className="w-full bg-black/50 border border-white/10 p-3 text-white text-xs outline-none focus:border-[#00f6ff]" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                 <input placeholder="EMAIL" required type="email" className="w-full bg-black/50 border border-white/10 p-3 text-white text-xs outline-none focus:border-[#00f6ff]" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                 <input placeholder="PASSWORD" required type="password" className="w-full bg-black/50 border border-white/10 p-3 text-white text-xs outline-none focus:border-[#00f6ff]" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                 <button className="w-full bg-[#00f6ff] text-black font-black py-3 text-[10px] uppercase tracking-[0.4em] hover:bg-[#00ff88] transition-all">GENERATE_ACCESS</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}