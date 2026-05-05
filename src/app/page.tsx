'use client'

import React, { useState } from 'react'

// --- MOCK DATA ---
const INITIAL_USERS = [
  { id: 1, name: "Aryan Sharma", batch: "CSB", year: "3rd", skills: ["Python", "FastAPI"], bio: "AI enthusiast." },
  { id: 2, name: "Isha Gupta", batch: "CSB", year: "3rd", skills: ["React", "Figma"], bio: "UI/UX Designer." }
]

export default function SkillSwapApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [search, setSearch] = useState('')
  const [profile, setProfile] = useState({ name: 'Aryan Sharma', bio: 'AI enthusiast.' })

  // --- UI COMPONENTS ---

  const Navbar = () => (
    <nav className="bg-white border-b p-4 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600 cursor-pointer" onClick={() => setActiveTab('home')}>SkillSwap</h1>
        <div className="flex gap-6 font-medium">
          <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-green-600' : ''}>Dashboard</button>
          <button onClick={() => setActiveTab('explore')} className={activeTab === 'explore' ? 'text-green-600' : ''}>Explore</button>
          <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'text-green-600' : ''}>Profile</button>
        </div>
      </div>
    </nav>
  )

  const Home = () => (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-bold mb-6">Trade What You Know, <br/><span className="text-green-600">Learn What You Don't.</span></h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">The easiest way to swap skills with your college mates.</p>
      <button onClick={() => setActiveTab('explore')} className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-bold">Start Swapping</button>
    </div>
  )

  const Explore = () => {
    const filtered = INITIAL_USERS.filter(u => u.skills.some(s => s.toLowerCase().includes(search.toLowerCase())))
    return (
      <div className="py-10 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Explore Skills</h2>
        <input 
          type="text" placeholder="Search skills..." className="w-full p-4 border rounded-xl mb-10"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(user => (
            <div key={user.id} className="bg-white p-6 border rounded-xl shadow-sm">
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-gray-500 mb-4">{user.batch} • {user.year} Year</p>
              <div className="flex gap-2 mb-6">
                {user.skills.map(s => <span key={s} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{s}</span>)}
              </div>
              <button onClick={() => alert('Request sent!')} className="w-full bg-green-500 text-white py-2 rounded-lg font-bold">Request Swap</button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const Dashboard = () => (
    <div className="py-10 max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8">Your Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 border rounded-xl text-center">
          <p className="text-gray-500 text-sm">Skills Shared</p>
          <p className="text-3xl font-bold text-green-600">3</p>
        </div>
        <div className="bg-white p-6 border rounded-xl text-center">
          <p className="text-gray-500 text-sm">Skills Learned</p>
          <p className="text-3xl font-bold text-green-600">2</p>
        </div>
        <div className="bg-white p-6 border rounded-xl text-center">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-3xl font-bold text-green-600">1</p>
        </div>
      </div>
      <div className="bg-white p-6 border rounded-xl">
        <h3 className="font-bold mb-4 text-xl">Recent Request</h3>
        <div className="flex justify-between items-center border-t pt-4">
          <div>
            <p className="font-bold">Rahul Varma</p>
            <p className="text-sm text-gray-500">Wants to learn Python</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => alert('Accepted')} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm">Accept</button>
            <button onClick={() => alert('Declined')} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">Decline</button>
          </div>
        </div>
      </div>
    </div>
  )

  const Profile = () => (
    <div className="py-10 max-w-xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Profile</h2>
      <div className="bg-white p-8 border rounded-xl shadow-sm space-y-6">
        <div>
          <label className="block font-bold mb-2">Name</label>
          <input type="text" className="w-full p-3 border rounded-lg" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
        </div>
        <div>
          <label className="block font-bold mb-2">Bio</label>
          <textarea className="w-full p-3 border rounded-lg min-h-[100px]" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
        </div>
        <button onClick={() => alert('Profile Saved!')} className="w-full bg-green-500 text-white py-3 rounded-lg font-bold">Save Changes</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      {activeTab === 'home' && <Home />}
      {activeTab === 'explore' && <Explore />}
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'profile' && <Profile />}
    </div>
  )
}
