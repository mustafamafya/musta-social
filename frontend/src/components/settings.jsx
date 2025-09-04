// src/components/Settings.jsx
export default function Settings() {
  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-4 text-musta-purple">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        <label className="block">
          <span className="text-gray-700">Dark Mode</span>
          <input type="checkbox" className="ml-2" />
        </label>
        <label className="block">
          <span className="text-gray-700">Notifications</span>
          <input type="checkbox" className="ml-2" />
        </label>
      </div>
    </div>
  );
}