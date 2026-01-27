'use client'
import { useState } from 'react' // 🔥 State যোগ করা হয়েছে
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

export default function Contact() {
  // ১. ফোর্ল ডাটা হ্যান্ডেল করার জন্য স্টেট
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' }) // ফর্ম ক্লিয়ার
        setTimeout(() => setStatus('idle'), 5000) // ৫ সেকেন্ড পর মেসেজ চলে যাবে
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error("Message Error:", error)
      setStatus('error')
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight"
          >
            Get In <span className="text-[#00f6ff]">Touch</span>
          </motion.h2>
          <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
            Have a project in mind or just want to say hi? Feel free to send a message.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-[#0b0f14] border border-[#00f6ff]/20 p-6 md:p-10 rounded-2xl shadow-[0_0_40px_rgba(0,246,255,0.03)]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f6ff] transition-all outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f6ff] transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Message</label>
              <textarea 
                rows="5" 
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#00f6ff] transition-all outline-none resize-none"
                required
              ></textarea>
            </div>

            {/* Status Messages */}
            {status === 'success' && <p className="text-green-400 text-xs text-center font-mono uppercase tracking-widest animate-pulse">&gt; Transmission Received Successfully_</p>}
            {status === 'error' && <p className="text-red-400 text-xs text-center font-mono uppercase tracking-widest">&gt; System Error: Transmission Failed_</p>}

            <button 
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-4 bg-[#00f6ff] hover:bg-[#00d8e0] text-[#0b0f14] font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_15px_rgba(0,246,255,0.2)] flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-50"
            >
              <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#00f6ff]/5 blur-[100px] rounded-full -z-10"></div>
    </section>
  )
}