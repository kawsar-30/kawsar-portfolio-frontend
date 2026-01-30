'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadMedia } from '@/utils/upload'
import { Trash2, Edit, Eye, Plus, X, UploadCloud, ShieldCheck, ShieldAlert, Clock, Calendar, Briefcase } from 'lucide-react'

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [viewService, setViewService] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const [formData, setFormData] = useState({ title: '', description: '', category: '', featured: false })
  const [file, setFile] = useState(null)

  const fetchServices = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`)
    const data = await res.json()
    if (data.success) setServices(data.data)
  }

  useEffect(() => { fetchServices() }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

 const toggleFeatured = async (service) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${service._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ featured: !service.featured }) // Toggle logic
    });
    if (res.ok) fetchServices();
  } catch (err) { console.error("Toggle failed", err); }
};

  const openModal = (service = null) => {
    if (service) {
      setEditMode(true)
      setSelectedId(service._id)
      setFormData({
        title: service.title, description: service.description,
        category: service.category || '', featured: service.featured || false
      })
    } else {
      setEditMode(false)
      setFormData({ title: '', description: '', category: '', featured: false })
    }
    setShowModal(true)
  }

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const currentService = services.find(s => s._id === selectedId);
    let mediaData = editMode ? currentService.media : [];

    // Jodi notun file select kora hoy, tobei update hobe
    if (file) {
      const uploaded = await uploadMedia(file);
      if (uploaded) {
        mediaData = [uploaded]; // Update with new file
      }
    }

    const url = editMode ? `${process.env.NEXT_PUBLIC_API_URL}/services/${selectedId}` : `${process.env.NEXT_PUBLIC_API_URL}/services`;
    const method = editMode ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
      },
      body: JSON.stringify({ ...formData, media: mediaData })
    });

    if (res.ok) { 
      setShowModal(false); 
      fetchServices(); 
      setFile(null); 
    }
  } catch (err) { 
    console.error("Submission error:", err); 
  } finally { 
    setLoading(false); 
  }
};

  const handleDelete = async (id) => {
    if (window.confirm("ARE_YOU_SURE_TO_TERMINATE_THIS_SERVICE?")) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      fetchServices()
    }
  }

  return (
    <div className="space-y-6 font-mono">
      {/* --- Header Area --- */}
      <div className="flex justify-between items-center bg-[#0d121a] p-6 border border-white/5 shadow-2xl">
        <div>
          <h1 className="text-xl font-black text-[#00f6ff] uppercase italic tracking-[0.2em]">Service_Matrix</h1>
          <p className="text-[9px] text-gray-500 uppercase mt-1">Active_Protocols: {services.length}</p>
        </div>
        <button onClick={() => openModal()} className="bg-[#00f6ff] text-black px-6 py-2 font-bold text-[10px] uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(0,246,255,0.2)]">
          + Inject_Service
        </button>
      </div>

      {/* --- Service Table View --- */}
      <div className="bg-[#0d121a] border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-white/5 text-[9px] uppercase text-gray-500 tracking-widest border-b border-white/5">
            <tr>
              <th className="p-4">Icon</th>
              <th className="p-4">Service_Identifier</th>
              <th className="p-4">Status</th>
              <th className="p-4">Deployment_Data</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {services.map((s) => (
              <tr key={s._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                  <div className="w-10 h-10 bg-black border border-white/10 flex items-center justify-center">
                    {s.media?.[0]?.url ? (
                      <img src={s.media[0].url} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                    ) : (
                      <Briefcase size={16} className="text-gray-700" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm font-bold text-white uppercase tracking-tighter">{s.title}</p>
                  <p className="text-[9px] text-[#00f6ff]">{s.category || 'General_Service'}</p>
                </td>
                <td className="p-4">
                   <button onClick={() => toggleFeatured(s)} className={`flex items-center gap-2 px-2 py-1 text-[8px] font-black uppercase border ${s.featured ? 'border-[#00f6ff] text-[#00f6ff]' : 'border-red-500/30 text-red-500'}`}>
                     {s.featured ? <ShieldCheck size={10}/> : <ShieldAlert size={10}/>}
                     {s.featured ? 'Live_Node' : 'Deactivated'}
                   </button>
                </td>
                <td className="p-4">
                  <div className="space-y-1 text-[9px] uppercase font-bold">
                    <p className="text-gray-500 flex items-center gap-1"><Calendar size={10}/> Post: <span className="text-white">{formatDate(s.createdAt)}</span></p>
                    <p className="text-gray-500 flex items-center gap-1"><Clock size={10}/> Sync: <span className="text-[#00f6ff]">{formatDate(s.updatedAt)}</span></p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-4 text-gray-500">
                    <button onClick={() => setViewService(s)} className="hover:text-white"><Eye size={16}/></button>
                    <button onClick={() => openModal(s)} className="hover:text-[#00f6ff]"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(s._id)} className="hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- View Modal --- */}
      <AnimatePresence>
        {viewService && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#0d121a] border border-[#00f6ff]/30 p-8 max-w-lg w-full relative">
              <button onClick={() => setViewService(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
              <h2 className="text-[#00f6ff] font-black text-xl mb-2 uppercase italic">{viewService.title}</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Category: {viewService.category}</p>
              <p className="text-sm text-gray-400 leading-relaxed italic mb-8 border-l-2 border-[#00f6ff] pl-4">{viewService.description}</p>
              <div className="flex justify-between text-[9px] text-gray-600 uppercase font-black">
                <p>Created: {formatDate(viewService.createdAt)}</p>
                <p>Modified: {formatDate(viewService.updatedAt)}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Form Modal --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0d121a] border border-[#00f6ff]/20 p-8 w-full max-w-xl">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <h2 className="text-white font-black uppercase italic tracking-widest">{editMode ? 'Update_Protocol' : 'New_Service_Injection'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="SERVICE_TITLE" className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-[#00f6ff]" 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title} required />
                  <input type="text" placeholder="CATEGORY" className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-[#00f6ff]" 
                      onChange={(e) => setFormData({...formData, category: e.target.value})} value={formData.category} />
                </div>
                <textarea placeholder="DETAILED_DESCRIPTION" rows="5" className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-[#00f6ff]" 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} value={formData.description} required></textarea>
                
                <div className="flex items-center gap-3 p-3 bg-black border border-white/10">
                   <input type="checkbox" id="feat-svc" className="accent-[#00f6ff]" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} />
                   <label htmlFor="feat-svc" className="text-[9px] text-gray-400 uppercase cursor-pointer tracking-widest">Authorize_Public_Display</label>
                </div>

                <div className="border border-dashed border-white/10 p-4 text-center">
                   <input type="file" className="text-[10px] text-gray-500 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                </div>

                <button disabled={loading} className="w-full bg-[#00f6ff] text-black font-black py-4 text-[10px] uppercase hover:tracking-[0.3em] transition-all">
                  {loading ? 'Processing_Sync...' : editMode ? 'Commit_Changes' : 'Initialize_Service'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}