'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit, Plus, X, Cpu, Calendar, Clock, UploadCloud, ShieldCheck } from 'lucide-react'

export default function AdminSkills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const [formData, setFormData] = useState({ name: '', category: '' })
  const [file, setFile] = useState(null)

  // ১. ডাটা ফেচ করা (Project/Service স্টাইল)
  const fetchSkills = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`)
      const data = await res.json()
      if (data.success) setSkills(data.data)
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  // ২. মডাল ওপেন লজিক
  const openModal = (skill = null) => {
    if (skill) {
      setEditMode(true)
      setSelectedId(skill._id)
      setFormData({ name: skill.name, category: skill.category || '' })
    } else {
      setEditMode(false)
      setFormData({ name: '', category: '' })
    }
    setFile(null)
    setShowModal(true)
  }

  // ৩. সাবমিট (FormData ব্যবহার করে - তোমার স্কিমা অনুযায়ী)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('category', formData.category)
      
      if (file) {
        // তোমার ব্যাকএন্ডে upload.single('icon') আছে, তাই কী হবে 'icon'
        data.append('icon', file) 
      }

      const url = editMode 
        ? `${process.env.NEXT_PUBLIC_API_URL}/skills/${selectedId}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/skills`
      
      const method = editMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
        },
        body: data
      })

      const result = await res.json()
      if (result.success) {
        setShowModal(false)
        fetchSkills()
      } else {
        alert("Error: " + result.message)
      }
    } catch (err) {
      console.error("Submit Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("ERASE_SKILL_PROTOCOL?")) return
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    })
    fetchSkills()
  }

  return (
    <div className="space-y-6 font-mono text-white">
      {/* --- Header Section --- */}
      <div className="flex justify-between items-center bg-[#0d121a] p-6 border border-white/5 shadow-2xl">
        <div>
          <h1 className="text-xl font-black text-[#00ff88] uppercase italic tracking-[0.2em]">Skill_Registry</h1>
          <p className="text-[9px] text-gray-500 uppercase mt-1">Active_Nodes: {skills.length}</p>
        </div>
        <button onClick={() => openModal()} className="bg-[#00ff88] text-black px-6 py-2 font-bold text-[10px] uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)]">
          + Inject_Skill
        </button>
      </div>

      {/* --- Table View (Project/Certification স্টাইল) --- */}
      <div className="bg-[#0d121a] border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-white/5 text-[9px] uppercase text-gray-500 border-b border-white/5">
            <tr>
              <th className="p-4">Visual_Icon</th>
              <th className="p-4">Skill_Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Log_Data</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {skills.map((skill) => (
              <tr key={skill._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                  <div className="w-10 h-10 bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                    {skill.icon?.url ? (
                      <img src={skill.icon.url} className="w-full h-full object-contain p-1 grayscale group-hover:grayscale-0 transition-all" alt="" />
                    ) : (
                      <Cpu size={16} className="text-gray-700" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm font-bold uppercase tracking-tighter">{skill.name}</p>
                </td>
                <td className="p-4">
                  <span className="text-[9px] font-black uppercase border border-[#00ff88]/30 text-[#00ff88] px-2 py-1">
                    {skill.category || 'General'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="space-y-1 text-[9px] uppercase font-bold text-gray-500">
                    <p className="flex items-center gap-1"><Calendar size={10}/> Added: <span className="text-white">{formatDate(skill.createdAt)}</span></p>
                    <p className="flex items-center gap-1"><Clock size={10}/> Sync: <span className="text-[#00ff88]">{formatDate(skill.updatedAt)}</span></p>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-4 text-gray-500">
                    <button onClick={() => openModal(skill)} className="hover:text-[#00ff88] transition-colors"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(skill._id)} className="hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Form Modal --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 20, opacity: 0 }}
              className="bg-[#0d121a] border border-[#00ff88]/20 p-8 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <h2 className="text-white font-black uppercase italic tracking-widest">
                  {editMode ? 'Edit_Skill_Node' : 'New_Skill_Entry'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[9px] text-gray-500 uppercase mb-1 block tracking-widest">Skill_Name</label>
                  <input 
                    type="text" 
                    placeholder="E.G. REACT, MONGODB" 
                    className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-[#00ff88] transition-all" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    value={formData.name} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="text-[9px] text-gray-500 uppercase mb-1 block tracking-widest">Category_Class</label>
                  <input 
                    type="text" 
                    placeholder="E.G. FRONTEND, DATABASE" 
                    className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-[#00ff88] transition-all" 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                    value={formData.category} 
                  />
                </div>

                {/* --- Icon Upload Field --- */}
                <div className="space-y-2">
                  <label className="text-[9px] text-gray-500 uppercase block tracking-widest">Icon_Visual (Image)</label>
                  <div className="bg-black border border-white/10 p-4">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="text-[10px] text-gray-400 file:mr-4 file:py-1 file:px-4 file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-[#00ff88] file:text-black cursor-pointer w-full" 
                      onChange={(e) => setFile(e.target.files[0])} 
                      required={!editMode}
                    />
                  </div>
                  {editMode && <p className="text-[8px] text-gray-600 uppercase italic">* Leave empty to keep existing icon</p>}
                </div>

                <button 
                  disabled={loading} 
                  className="w-full bg-[#00ff88] text-black font-black py-4 text-[10px] uppercase hover:tracking-[0.2em] transition-all disabled:opacity-50 shadow-[0_5px_15px_rgba(0,255,136,0.1)]"
                >
                  {loading ? 'Processing_Data...' : editMode ? 'Update_Skill' : 'Initialize_Skill'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}