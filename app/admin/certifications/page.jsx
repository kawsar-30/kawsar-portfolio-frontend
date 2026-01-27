'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit, Eye, Plus, X, ShieldCheck, ShieldAlert, Award, Calendar, Link as LinkIcon, ExternalLink } from 'lucide-react'

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [viewCert, setViewCert] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const [formData, setFormData] = useState({ 
    title: '', issuer: '', issueDate: '', credentialUrl: '', featured: false 
  })
  const [file, setFile] = useState(null)

  // ১. ডাটা ফেচ করা (Project/Service স্টাইল)
  const fetchCertificates = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certifications`)
      const data = await res.json()
      if (data.success) setCertificates(data.data)
    } catch (err) { console.error("Fetch error:", err) }
  }

  useEffect(() => { fetchCertificates() }, [])

  const formatDate = (dateString) => {
    if(!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  // ২. ফিচারড টগল
  const toggleFeatured = async (cert) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certifications/${cert._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ featured: !cert.featured })
      })
      if (res.ok) fetchCertificates()
    } catch (err) { console.error("Toggle failed", err) }
  }

  // ৩. মডাল ওপেন লজিক
  const openModal = (cert = null) => {
    if (cert) {
      setEditMode(true)
      setSelectedId(cert._id)
      setFormData({
        title: cert.title,
        issuer: cert.issuer || '',
        issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '', 
        credentialUrl: cert.credentialUrl || '',
        featured: cert.featured || false
      })
    } else {
      setEditMode(false)
      setFormData({ title: '', issuer: '', issueDate: '', credentialUrl: '', featured: false })
    }
    setFile(null)
    setShowModal(true)
  }

  // ৪. সাবমিট (FormData ব্যবহার করে - Project/Service স্টাইল)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('issuer', formData.issuer)
      data.append('issueDate', formData.issueDate)
      data.append('credentialUrl', formData.credentialUrl)
      data.append('featured', formData.featured)
      
      if (file) {
        data.append('media', file) // ব্যাকএন্ডে upload.array('media') আছে
      }

      const url = editMode 
        ? `${process.env.NEXT_PUBLIC_API_URL}/certifications/${selectedId}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/certifications`
      
      const method = editMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: data
      })

      const result = await res.json()
      if (result.success) {
        setShowModal(false)
        fetchCertificates()
      } else {
        alert("Error: " + result.message)
      }
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("PURGE_THIS_CERTIFICATE_RECORD?")) return
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certifications/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    })
    fetchCertificates()
  }

  return (
    <div className="space-y-6 font-mono text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#0d121a] p-6 border border-white/5 shadow-2xl">
        <div>
          <h1 className="text-xl font-black text-[#facc15] uppercase italic tracking-[0.2em]">Achievement_Vault</h1>
          <p className="text-[9px] text-gray-500 uppercase mt-1">Verified_Assets: {certificates.length}</p>
        </div>
        <button onClick={() => openModal()} className="bg-[#facc15] text-black px-6 py-2 font-bold text-[10px] uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)]">
          + Secure_New_Award
        </button>
      </div>

      {/* Table View (Service/Project স্টাইল) */}
      <div className="bg-[#0d121a] border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-white/5 text-[9px] uppercase text-gray-500 border-b border-white/5">
            <tr>
              <th className="p-4">Visual</th>
              <th className="p-4">Credential_Info</th>
              <th className="p-4">Status</th>
              <th className="p-4">Timeline</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {certificates.map((cert) => (
              <tr key={cert._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                  <div className="w-10 h-10 bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                    {cert.media?.[0]?.url ? (
                      <img src={cert.media[0].url} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt="" />
                    ) : (
                      <Award size={16} className="text-gray-700" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm font-bold uppercase tracking-tighter">{cert.title}</p>
                  <p className="text-[9px] text-[#facc15] italic">{cert.issuer || 'Unknown_Issuer'}</p>
                </td>
                <td className="p-4">
                   <button onClick={() => toggleFeatured(cert)} className={`flex items-center gap-2 px-2 py-1 text-[8px] font-black uppercase border ${cert.featured ? 'border-[#facc15] text-[#facc15]' : 'border-red-500/30 text-red-500'}`}>
                     {cert.featured ? <ShieldCheck size={10}/> : <ShieldAlert size={10}/>}
                     {cert.featured ? 'Live_Asset' : 'Hidden_Node'}
                   </button>
                </td>
                <td className="p-4">
                  <div className="space-y-1 text-[9px] uppercase font-bold text-gray-500">
                    <p className="flex items-center gap-1"><Calendar size={10}/> Issued: <span className="text-white">{formatDate(cert.issueDate)}</span></p>
                    {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" className="flex items-center gap-1 hover:text-[#facc15] transition-colors"><LinkIcon size={10}/> Verify_Link</a>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-4 text-gray-500">
                    <button onClick={() => setViewCert(cert)} className="hover:text-white"><Eye size={16}/></button>
                    <button onClick={() => openModal(cert)} className="hover:text-[#facc15]"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(cert._id)} className="hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewCert && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#0d121a] border border-[#facc15]/30 p-8 max-w-lg w-full relative">
              <button onClick={() => setViewCert(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
              <h2 className="text-[#facc15] font-black text-xl mb-1 uppercase italic">{viewCert.title}</h2>
              <p className="text-[10px] text-gray-500 uppercase mb-4 tracking-widest">{viewCert.issuer}</p>
              <div className="aspect-video bg-black mb-6 border border-white/5 overflow-hidden">
                {viewCert.media?.[0]?.url && <img src={viewCert.media[0].url} className="w-full h-full object-contain" alt="" />}
              </div>
              <div className="flex justify-between items-center text-[9px] text-gray-600 uppercase font-black border-t border-white/5 pt-4">
                <p>Date: {formatDate(viewCert.issueDate)}</p>
                {viewCert.credentialUrl && <a href={viewCert.credentialUrl} target="_blank" className="text-[#facc15] flex items-center gap-1 hover:underline">Verify_Credential <ExternalLink size={10}/></a>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Form Modal (Service/Project স্টাইল) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0d121a] border border-[#facc15]/20 p-8 w-full max-w-xl">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <h2 className="text-white font-black uppercase italic tracking-widest">{editMode ? 'Modify_Award' : 'Initialize_Credential'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="CERTIFICATE_TITLE" className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-[#facc15]" 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title} required />
                
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="ISSUING_ORGANIZATION" className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-[#facc15]" 
                      onChange={(e) => setFormData({...formData, issuer: e.target.value})} value={formData.issuer} />
                  <input type="date" className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-[#facc15]" 
                      onChange={(e) => setFormData({...formData, issueDate: e.target.value})} value={formData.issueDate} />
                </div>

                <input type="text" placeholder="CREDENTIAL_URL (HTTPS://...)" className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-[#facc15]" 
                    onChange={(e) => setFormData({...formData, credentialUrl: e.target.value})} value={formData.credentialUrl} />
                
                <div className="flex items-center gap-3 p-3 bg-black border border-white/10">
                   <input type="checkbox" id="feat-cert" className="accent-[#facc15]" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} />
                   <label htmlFor="feat-cert" className="text-[9px] text-gray-400 uppercase cursor-pointer">Authorize_Public_Deployment</label>
                </div>

                <div className="border border-dashed border-white/10 p-4 text-center">
                   <p className="text-[9px] text-gray-600 uppercase mb-2">Upload_Credential_Visual</p>
                   <input type="file" className="text-[10px] text-gray-500 cursor-pointer mx-auto" onChange={(e) => setFile(e.target.files[0])} />
                </div>

                <button disabled={loading} className="w-full bg-[#facc15] text-black font-black py-4 text-[10px] uppercase hover:tracking-widest transition-all">
                  {loading ? 'Executing_Sync...' : editMode ? 'Update_Credential' : 'Store_Achievement'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}