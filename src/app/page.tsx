'use client'

import React, { useState } from 'react'

const USERS = [
  { id: 1, name: "Aryan Sharma", skills: ["Python", "FastAPI"], bio: "AI enthusiast.", match: "98%" },
  { id: 2, name: "Isha Gupta", skills: ["React", "Figma"], bio: "UI/UX Designer.", match: "92%" }
]

export default function SkillSwapApp() {
  const [tab, setTab] = useState('home')
  const [search, setSearch] = useState('')
  const [sent, setSent] = useState<number[]>([])

  const Nav = () => (
    <nav className="bg-white/80 backdrop-blur-md border-b p-4 sticky top-0 z-50 flex justify-between items-center px-8">
      <h1 className="text-xl font-black text-emerald-600 cursor-pointer" onClick={() => setTab('home')}>SkillSwap</h1>
      <div className="flex gap-4 bg-gray-100 p-1 rounded-xl">
        {['dashboard', 'explore', 'profile'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase ${tab === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}>{t}</button>
        ))}
      </div>
    </nav>
  )

  const Home = () => (
    <div className="py-20 text-center px-4 max-w-3xl mx-auto">
      <h1 className="text-6xl font-black mb-6 leading-tight">Swap Your <span className="text-emerald-500">Skills</span>, Grow Your Mind.</h1>
      <p className="text-lg text-gray-500 mb-10">The decentralized learning platform for students. Connect, teach, and learn anything for free.</p>
      <div className="flex justify-center gap-4">
        <button onClick={() => setTab('explore')} className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-600 transition-all">Start Exploring</button>
        <button onClick={() => setTab('dashboard')} className="border-2 px-8 py-4 rounded-xl font-bold hover:bg-gray-50">Dashboard</button>
      </div>
    </div>
  )

  const Explore = () => (
    <div className="py-12 max-w-5xl mx-auto px-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black">Explore</h2>
        <input type="text" placeholder="Search skills..." className="p-3 border rounded-xl w-64 outline-none focus:border-emerald-500" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {USERS.filter(u => u.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))).map(u => (
          <div key={u.id} className="bg-white p-6 rounded-3xl border hover:border-emerald-200 transition-all shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">{u.name[0]}</div>
              <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{u.match} Match</span>
            </div>
            <h3 className="text-xl font-bold">{u.name}</h3>
            <p className="text-gray-500 text-sm mb-4 italic">"{u.bio}"</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {u.skills.map(s => <span key={s} className="px-3 py-1 rounded-lg bg-gray-50 text-xs font-bold border">{s}</span>)}
            </div>
            <button 
              onClick={() => setSent([...sent, u.id])} 
              disabled={sent.includes(u.id)}
              className={`w-full py-3 rounded-xl font-bold text-sm ${sent.includes(u.id) ? 'bg-gray-100 text-gray-400' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
            >
              {sent.includes(u.id) ? '✓ Requested' : 'Request Swap'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const Dashboard = () => (
    <div className="py-12 max-w-5xl mx-auto px-6">
      <h2 className="text-3xl font-black mb-8">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[ {l: 'Swaps', v: '03'}, {l: 'Hours', v: '12'}, {l: 'Rate', v: '98%'}, {l: 'Badges', v: '05'} ].map(s => (
          <div key={s.l} className="bg-white p-6 rounded-2xl border text-center">
            <p className="text-[10px] uppercase font-black text-gray-400 mb-1">{s.l}</p>
            <p className="text-2xl font-black text-emerald-500">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-3xl border shadow-sm">
        <h3 className="font-bold text-lg mb-4">Incoming Request</h3>
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border">
          <div>
            <p className="font-bold">Rahul Varma</p>
            <p className="text-xs text-gray-500">Node.js looking for Python</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => alert('Accepted')} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold">Accept</button>
            <button className="border px-4 py-2 rounded-lg text-xs font-bold text-gray-400">Ignore</button>
          </div>
        </div>
      </div>
    </div>
  )

  const Profile = () => (
    <div className="py-12 max-w-xl mx-auto px-6 text-center">
      <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto mb-8 flex items-center justify-center text-3xl text-white font-black">A</div>
      <div className="bg-white p-8 rounded-[32px] border shadow-lg space-y-6">
        <input type="text" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-emerald-500 font-bold" defaultValue="Aryan Sharma" />
        <textarea className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-emerald-500 min-h-[100px]" defaultValue="AI enthusiast and backend explorer." />
        <button onClick={() => alert('Saved')} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition-all">Save Profile</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Nav />
      {tab === 'home' && <Home />}
      {tab === 'explore' && <Explore />}
      {tab === 'dashboard' && <Dashboard />}
      {tab === 'profile' && <Profile />}
    </div>
  )
}
