// src/pages/Dashboard.jsx
import { useState } from 'react';
import Navbar from './navbar';
import Home from './home';
import Friends from './friends';
import Profile from './profile';
import Settings from './settings';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-musta-bg text-gray-800">
      <Navbar setActiveTab={setActiveTab} activeTab={activeTab} />
      <main className="pt-24 px-6 transition-all duration-300 ease-in-out">
        {activeTab === 'home' && <Home />}
        {activeTab === 'friends' && <Friends />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}