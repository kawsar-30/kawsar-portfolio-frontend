'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit, X, FileText, ImageIcon, Loader2 } from 'lucide-react'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const [formData, setFormData] = useState({ title: '', description: '', category: '', featured: false })
  
  // 🔥 ALADA DUITA INPUT FIELD STATE
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [mainContentFile, setMainContentFile] = useState(null)

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`)
      const data = await res.json()
      if (data.success) setProjects(data.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchProjects() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // 🔥 FormData te shob field add kora
    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('category', formData.category)
    data.append('featured', formData.featured)

    // 🔥 BACKEND ERROR FIX: Backend 'media' name e array expect korche
    // Tai thumbnail ar pdf/video duita-kei 'media' key te append korte hobe
    if (thumbnailFile) {
      data.append('media', thumbnailFile) // Index 0 hobe
    }
    if (mainContentFile) {
      data.append('media', mainContentFile) // Index 1 hobe
    }

    try {
      const url = editMode 
        ? `${process.env.NEXT_PUBLIC_API_URL}/projects/${selectedId}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/projects`

      const res = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
          // ❌ GURUTTO-PURNO: Ekhane 'Content-Type' thaka jabe na
        },
        body: data
      })

      const result = await res.json()

      if (res.ok && result.success) {
        setShowModal(false)
        fetchProjects()
        setThumbnailFile(null)
        setMainContentFile(null)
        setEditMode(false)
      } else {
        alert("Upload Failed: " + result.message)
      }
    } catch (err) {
      console.error(err)
      alert("Network Error!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 font-mono text-white bg-[#0b0f14] min-h-screen">
      <div className="flex justify-between items-center mb-8 bg-[#0d121a] p-6 border border-white/5">
        <h1 className="text-xl font-black uppercase italic tracking-tighter text-[#00ff88]">System_Admin_Control</h1>
        <button onClick={() => { 
          setEditMode(false); 
          setFormData({title:'', description:'', category:'', featured: false});
          setThumbnailFile(null);
          setMainContentFile(null);
          setShowModal(true); 
        }} className="bg-[#00ff88] text-black px-5 py-2 font-bold text-xs uppercase hover:bg-white transition-all">
          + New_Deployment
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-[#0d121a] border border-white/5">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase text-gray-500">
            <tr className="border-b border-white/5">
              <th className="p-4">Ref</th>
              <th className="p-4">Title</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((proj) => (
              <tr key={proj._id} className="hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="w-10 h-10 bg-black border border-white/10">
                    {proj.media?.[0] && <img src={proj.media[0].url} className="w-full h-full object-cover grayscale" />}
                  </div>
                </td>
                <td className="p-4 text-sm font-bold uppercase">{proj.title}</td>
                <td className="p-4 flex justify-center gap-4">
                  <button onClick={() => { 
                    setEditMode(true); 
                    setSelectedId(proj._id); 
                    setFormData(proj); 
                    setShowModal(true); 
                  }} className="text-gray-400 hover:text-[#00ff88]"><Edit size={16}/></button>
                  <button onClick={async () => {
                    if(confirm("DELETE?")) {
                      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${proj._id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                      });
                      fetchProjects();
                    }
                  }} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0d121a] border border-[#00ff88]/30 p-8 w-full max-w-xl">
              <div className="flex justify-between mb-6 border-b border-white/5 pb-4">
                <h2 className="text-white font-black uppercase text-sm italic">{editMode ? 'Modify_Project' : 'Create_New_Project'}</h2>
                <button onClick={() => setShowModal(false)}><X size={20}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" placeholder="TITLE" className="w-full bg-black border border-white/10 p-3 text-xs text-white outline-none focus:border-[#00ff88]" 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title} required />
                
                <input type="text" placeholder="CATEGORY" className="w-full bg-black border border-white/10 p-3 text-xs text-white outline-none focus:border-[#00ff88]" 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} value={formData.category} />

                {/* 🔥 DUITA ALADA INPUT FIELD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 border border-white/5 p-3 bg-black/50">
                    <label className="text-[9px] text-gray-500 uppercase flex items-center gap-2"><ImageIcon size={14}/> Thumbnail (Image)</label>
                    <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} className="text-[10px] w-full" />
                  </div>
                  <div className="space-y-2 border border-white/5 p-3 bg-black/50">
                    <label className="text-[9px] text-gray-500 uppercase flex items-center gap-2"><FileText size={14}/> Asset (PDF/Video)</label>
                    <input type="file" accept="application/pdf,video/*" onChange={(e) => setMainContentFile(e.target.files[0])} className="text-[10px] w-full" />
                  </div>
                </div>

                <textarea placeholder="DESCRIPTION" rows="3" className="w-full bg-black border border-white/10 p-3 text-xs text-white outline-none focus:border-[#00ff88]" 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} value={formData.description}></textarea>

                <button disabled={loading} className="w-full bg-[#00ff88] text-black font-black py-4 text-xs uppercase flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={16}/> : 'COMMIT_DATA'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}