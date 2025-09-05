import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Load theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:8000/api/v1/user-info/', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/register');
    } catch (err) {
      console.error('Account deletion failed:', err);
    }
  };

  return (
    <div className="animate-fadeIn max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
      <h1 className="text-3xl font-bold text-musta-purple dark:text-purple-300">
        Settings
      </h1>

      {/* Theme Switch */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          Dark Mode
        </span>
        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${
            darkMode ? 'bg-purple-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
              darkMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Delete Account */}
      <div className="pt-6 border-t border-gray-300 dark:border-gray-700">
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Delete My Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md space-y-4 border border-red-300">
            <h2 className="text-xl font-bold text-red-600">
              Are you sure you want to delete your account?
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This action is permanent. All your posts, comments, likes, and profile data will be deleted and cannot be recovered.
            </p>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}