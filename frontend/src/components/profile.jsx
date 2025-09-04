import { useEffect, useState } from 'react';
import { getUserInfo } from '../api/user';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    getUserInfo(token)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch user info:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10 text-musta-purple">Loading profile...</div>;
  if (!user) return <div className="text-center mt-10 text-red-500">User not found</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-musta-bg rounded-2xl shadow-xl border border-musta-purple space-y-8">
      {/* Title */}
        <h1 className="text-3xl font-bold text-blue-600 mb-2 animate-pulse">Musta Social</h1>

      {/* Avatar + Name */}
      <div className="flex flex-col items-center space-y-3">
         <img
          src={`http://localhost:8000${user.profile_img}`}
          alt="Profile"
          className="w-40 h-40 rounded-full border-4 border-musta-purple shadow-md"
        />
        <h2 className="text-xl font-semibold text-red-800 animate-pulse">{user.first_name} {user.last_name}</h2>
        <p className="text-sm text-gray-500">@{user.username}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div><span className="font-semibold text-musta-purple">Gender:</span> {user.gender || '—'}</div>
        <div><span className="font-semibold text-musta-purple">Age:</span> {user.age || '—'}</div>
        <div className="col-span-2">
          <span className="font-semibold text-musta-purple">Address:</span> {user.address || '—'}
        </div>
      </div>

      {/* Actions */}
        <div className="flex justify-center space-x-4 pt-4">
        <button className="px-5 py-2.5 bg-blue-500 text-black font-semibold rounded-lg shadow-md hover:bg-green-300 hover:shadow-lg transition duration-300 ease-in-out">
            Edit Profile
        </button>
        <button className="px-5 py-2.5 bg-gray-100 text-gray-800 font-medium rounded-lg shadow-sm hover:bg-gray-200 hover:shadow-md transition duration-300 ease-in-out">
            Logout
        </button>
        </div>
      </div>
 
  );
}