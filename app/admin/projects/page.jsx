'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadMedia } from '@/utils/upload'
import { Trash2, Edit, Eye, Plus, X, UploadCloud, ShieldCheck, ShieldAlert, Clock, Calendar } from 'lucide-react'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [viewProject, setViewProject] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const [formData, setFormData] = useState({
    title: '', description: '', category: '', featured: false 
  })
  const [file, setFile] = useState(null)

  const fetchProjects = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`)
    const data = await res.json()
    if (data.success) setProjects(data.data)
  }

  useEffect(() => { fetchProjects() }, [])

  // ডেট ফরম্যাট করার ফাংশন (উদা: Jan 25, 2026)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  const toggleFeatured = async (proj) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${proj._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ featured: !proj.featured })
      })
      if (res.ok) fetchProjects()
    } catch (err) { console.error("Toggle failed", err) }
  }

  const openModal = (proj = null) => {
    if (proj) {
      setEditMode(true)
      setSelectedId(proj._id)
      setFormData({
        title: proj.title, description: proj.description,
        category: proj.category || '', featured: proj.featured || false
      })
    } else {
      setEditMode(false)
      setFormData({ title: '', description: '', category: '', featured: false })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let mediaData = editMode ? projects.find(p => p._id === selectedId).media : []
      if (file) {
        const uploaded = await uploadMedia(file)
        if (uploaded) mediaData = [uploaded]
      }
      const url = editMode ? `${process.env.NEXT_PUBLIC_API_URL}/projects/${selectedId}` : `${process.env.NEXT_PUBLIC_API_URL}/projects`
      const method = editMode ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify({ ...formData, media: mediaData })
      })
      if (res.ok) { setShowModal(false); fetchProjects(); setFile(null); }
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (window.confirm("ARE_YOU_SURE? DATA_WILL_BE_PURGED.")) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      fetchProjects()
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center bg-[#0d121a] p-6 border border-white/5 shadow-xl">
        <h1 className="text-xl font-black text-white uppercase italic tracking-[0.2em]">Project_Core_Ledger</h1>
        <button onClick={() => openModal()} className="bg-[#00ff88] text-black px-5 py-2 font-bold text-[10px] uppercase hover:bg-white transition-all shadow-lg shadow-[#00ff88]/10">
          + Initialize_Node
        </button>
      </div>

      <div className="bg-[#0d121a] border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-white/5 text-[9px] uppercase text-gray-500 tracking-widest border-b border-white/5">
            <tr>
              <th className="p-4">Ref</th>
              <th className="p-4">Project_Title</th>
              <th className="p-4">Visibility</th>
              <th className="p-4">Timestamps</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((proj) => (
              <tr key={proj._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                  <div className="w-10 h-10 bg-black border border-white/10 p-0.5">
                    {proj.media?.[0]?.url && <img src={proj.media[0].url} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />}
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm font-bold text-white uppercase tracking-tighter">{proj.title}</p>
                  <p className="text-[9px] text-gray-500">{proj.category || 'N/A'}</p>
                </td>
                <td className="p-4">
                   <button onClick={() => toggleFeatured(proj)} className={`flex items-center gap-2 px-2 py-1 text-[8px] font-black uppercase border ${proj.featured ? 'border-[#00ff88] text-[#00ff88]' : 'border-red-500/30 text-red-500'}`}>
                     {proj.featured ? <ShieldCheck size={10}/> : <ShieldAlert size={10}/>}
                     {proj.featured ? 'Live' : 'Hidden'}
                   </button>
                </td>
                <td className="p-4">
                  <div className="space-y-1 text-[9px] uppercase font-bold">
                    <p className="text-gray-500 flex items-center gap-1"><Calendar size={10}/> Created: <span className="text-white">{formatDate(proj.createdAt)}</span></p>
                    <p className="text-gray-500 flex items-center gap-1"><Clock size={10}/> Updated: <span className="text-[#00ff88]">{formatDate(proj.updatedAt)}</span></p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-4 text-gray-500">
                    <button onClick={() => setViewProject(proj)} className="hover:text-white"><Eye size={16}/></button>
                    <button onClick={() => openModal(proj)} className="hover:text-[#00ff88]"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(proj._id)} className="hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- View Modal with Timestamps --- */}
      <AnimatePresence>
        {viewProject && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0d121a] border border-white/10 p-8 max-w-lg w-full relative shadow-2xl">
              <button onClick={() => setViewProject(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
              <h2 className="text-[#00ff88] font-black text-xl mb-4 uppercase italic tracking-tighter">{viewProject.title}</h2>
              <div className="h-48 bg-black mb-6 border border-white/5 shadow-inner">
                {viewProject.media?.[0]?.url && <img src={viewProject.media[0].url} className="w-full h-full object-contain" />}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">{viewProject.description}</p>
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-[9px] uppercase tracking-widest text-gray-500">
                <div><p>Initial_Deployment</p><p className="text-white mt-1">{formatDate(viewProject.createdAt)}</p></div>
                <div><p>Last_Modification</p><p className="text-[#00ff88] mt-1">{formatDate(viewProject.updatedAt)}</p></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Form Modal (Same as before) --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0d121a] border border-[#00ff88]/20 p-8 w-full max-w-xl shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <h2 className="text-white font-black uppercase italic tracking-widest">{editMode ? 'Update_Project' : 'New_Project_Node'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="TITLE" className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-[#00ff88]" 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title} required />
                <input type="text" placeholder="CATEGORY" className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-[#00ff88]" 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} value={formData.category} />
                <textarea placeholder="DESCRIPTION" rows="4" className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-[#00ff88]" 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} value={formData.description}></textarea>
                <div className="flex items-center gap-3 p-3 bg-black border border-white/10">
                   <input type="checkbox" id="feat" className="accent-[#00ff88]" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} />
                   <label htmlFor="feat" className="text-[9px] text-gray-400 uppercase cursor-pointer">Live_on_Portfolio</label>
                </div>
                <div className="border border-dashed border-white/10 p-4 text-center hover:bg-white/[0.01] transition-all">
                   <input type="file" className="text-[10px] text-gray-500 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                </div>
                <button disabled={loading} className="w-full bg-[#00ff88] text-black font-black py-4 text-[10px] uppercase hover:tracking-[0.3em] transition-all">
                  {loading ? 'Processing...' : editMode ? 'Execute_Update' : 'Commit_to_Database'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}