'use client'
import { useState } from 'react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const result = await res.json()

      if (result.success) {
        // এখানে নাম 'adminToken' করে দেওয়া হয়েছে যাতে Layout-এর সাথে মিলে যায়
        localStorage.setItem('adminToken', result.data.token)
        alert('Access Granted!')
        window.location.href = '/admin' // হার্ড রিডাইরেক্ট যাতে স্টেট পরিষ্কার হয়
      } else {
        alert(result.message || 'Login Failed')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-mono">
      <form onSubmit={handleLogin} className="p-8 border border-[#00f6ff]/30 bg-[#0d121a] space-y-4 w-96">
        <h2 className="text-[#00f6ff] text-xl font-black italic uppercase tracking-tighter">Auth_Gateway</h2>
        <input type="email" placeholder="ADMIN_EMAIL" value={email} onChange={(e)=>setEmail(e.target.value)}
          className="w-full bg-black border border-white/10 p-3 text-white outline-none focus:border-[#00f6ff]" required />
        <input type="password" placeholder="PASSWORD" value={password} onChange={(e)=>setPassword(e.target.value)}
          className="w-full bg-black border border-white/10 p-3 text-white outline-none focus:border-[#00f6ff]" required />
        <button className="w-full bg-[#00f6ff] text-black font-bold py-3 hover:opacity-80 transition-all">INITIALIZE_LOGIN</button>
      </form>
    </div>
  )
}