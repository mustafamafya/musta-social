export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = ['home', 'friends', 'profile', 'settings'];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex justify-between items-center px-6 py-4">
      <div className="flex space-x-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize ${
              activeTab === tab ? 'text-purple-600 font-bold' : 'text-gray-600'
            } hover:text-purple-500 transition`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="text-purple-600 font-bold text-lg animate-pulse">
        Musta Social ✨
      </div>
    </nav>
  );
}