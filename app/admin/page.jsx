'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, Briefcase, Mail, Activity, Eye, ArrowUpRight } from 'lucide-react'

export default function AdminDashboard() {
  const [data, setData] = useState({
    visitors: [],
    messages: [],
    projects: [],
    services: []
  })

  
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('adminToken')
      const headers = { 'Authorization': `Bearer ${token}` }
      try {
        const [vRes, mRes, pRes, sRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/visitors`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`)
        ])
        
        const vData = await vRes.json()
        const mData = await mRes.json()
        const pData = await pRes.json()
        const sData = await sRes.json()

        setData({
          visitors: vData.data || [],
          messages: mData.data || [],
          projects: pData.data || [],
          services: sData.data || []
        })
      } catch (err) { console.error("Dashboard Sync Error:", err) }
    }
    fetchDashboardData()
  }, [])

  
  const visitorChartData = data.visitors.slice(0, 7).map((v, i) => ({
    name: `Node_${i + 1}`,
    hits: v.visits
  }))

  const deviceData = [
    { name: 'Desktop', value: 70, color: '#00f6ff' },
    { name: 'Mobile', value: 30, color: '#ff0055' },
  ]

  const stats = [
    { label: 'Total Traffic', value: data.visitors.reduce((acc, v) => acc + v.visits, 0), icon: <Eye />, color: '#00f6ff' },
    { label: 'Live Projects', value: data.projects.length, icon: <Briefcase />, color: '#00ff88' },
    { label: 'New Messages', value: data.messages.filter(m => m.status === 'new').length, icon: <Mail />, color: '#ff0055' },
    { label: 'Services', value: data.services.length, icon: <Activity />, color: '#facc15' },
  ]

  return (
    <div className="space-y-8 font-mono">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Command_Center</h1>
          <p className="text-[10px] text-gray-500 tracking-[0.3em]">System_Overwatch_Active</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] text-[#00ff88] font-bold">Uptime: 99.9%</p>
          <p className="text-[9px] text-gray-600 uppercase">Last_Sync: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-5 bg-[#0d121a] border border-white/5 rounded-sm relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
              {stat.icon}
            </div>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <h2 className="text-3xl font-black text-white mt-1" style={{ color: stat.color }}>{stat.value}</h2>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Main Traffic Chart --- */}
        <div className="lg:col-span-2 bg-[#0d121a] border border-white/5 p-6 rounded-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-white tracking-widest uppercase">Traffic_Flow_Analysis</h3>
            <ArrowUpRight size={14} className="text-gray-600" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitorChartData}>
                <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                  contentStyle={{backgroundColor: '#0d121a', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px'}}
                />
                <Bar dataKey="hits" fill="#00f6ff" radius={[2, 2, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Device Distribution --- */}
        <div className="bg-[#0d121a] border border-white/5 p-6 rounded-sm flex flex-col items-center">
          <h3 className="text-xs font-black text-white tracking-widest uppercase mb-10 self-start">Environment_Split</h3>
          <div className="h-[180px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {deviceData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">70%</span>
              <span className="text-[8px] text-gray-500">DESKTOP</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4 w-full justify-center">
            {deviceData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-[9px] text-gray-400">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Recent Activity Table (Brief) --- */}
      <div className="bg-[#0d121a] border border-white/5 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/5 text-[10px] font-black tracking-widest text-[#00ff88]">
          RECENT_MESSAGE_SIGNALS
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px]">
            <thead className="bg-white/5 text-gray-500 italic">
              <tr>
                <th className="p-3">SENDER</th>
                <th className="p-3">SUBJECT</th>
                <th className="p-3">TIME</th>
                <th className="p-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {data.messages.slice(0, 3).map((m, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 font-bold text-gray-300">{m.name}</td>
                  <td className="p-3 text-gray-500 uppercase">{m.subject || 'Inquiry'}</td>
                  <td className="p-3 text-gray-600">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded-xs ${m.status === 'new' ? 'bg-[#ff0055]/20 text-[#ff0055]' : 'bg-gray-800 text-gray-400'}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}