import { useState, useEffect } from 'react';

export default function Friends() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem('access_token');

  // 🔍 Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:8000/api/v1/follow/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, []);

  // ➕ Follow user
  const handleFollow = async username => {
    try {
      await fetch(`http://localhost:8000/api/v1/follow/${username}/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowing(prev => [...prev, username]);
    } catch (err) {
      console.error('Follow failed:', err);
    }
  };

  // ➖ Unfollow user
  const handleUnfollow = async username => {
    try {
      await fetch(`http://localhost:8000/api/v1/follow/${username}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowing(prev => prev.filter(u => u !== username));
    } catch (err) {
      console.error('Unfollow failed:', err);
    }
  };

  // 🧩 Render user card
  const renderUserCard = user => (
    <div
      key={user.username}
      onClick={() => setSelectedUser(user)}
      className="cursor-pointer bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
    >
      <h3 className="text-xl font-bold text-purple-700 mb-1">{user.username}</h3>
      <p className="text-sm text-gray-600 mb-1">📧 {user.email}</p>
      <p className="text-sm text-gray-600 mb-1">
        🗓️ Joined: {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Unknown'}
      </p>
      <div className="flex gap-4 text-sm text-gray-500 mt-2">
        <span>👥 Followers: {user.followers_count || 0}</span>
        <span>➡️ Following: {user.following_count || 0}</span>
      </div>
    </div>
  );

  // 👤 Render selected profile
const renderProfile = user => (
  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md mx-auto text-center space-y-6">
    
    {/* Profile Image */}
    <div className="flex justify-center">
      <img
        src={`http://localhost:8000${user.profile_img || '/media/profile_img/default.jpg'}`}

        alt={`${user.username}'s profile`}
        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-purple-500 shadow-md"
      />
    </div>

    {/* Username */}
    <h2 className="text-3xl sm:text-4xl font-bold text-purple-700">{user.username}</h2>

    {/* Email */}
    <p className="text-gray-600 text-sm sm:text-base">📧 {user.email}</p>

    {/* Follower Stats */}
    <div className="flex justify-center gap-8 pt-2">
      <div>
        <p className="text-xl font-semibold text-purple-600">{user.followers_count || 0}</p>
        <p className="text-xs text-gray-500">Followers</p>
      </div>
      <div>
        <p className="text-xl font-semibold text-purple-600">{user.following_count || 0}</p>
        <p className="text-xs text-gray-500">Following</p>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-center gap-4 pt-4">
      {following.includes(user.username) ? (
        <button
          onClick={() => handleUnfollow(user.username)}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Unfollow
        </button>
      ) : (
        <button
          onClick={() => handleFollow(user.username)}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Follow
        </button>
      )}

      <button
        onClick={() => setSelectedUser(null)}
        className="text-sm text-gray-500 hover:underline self-center"
      >
        ← Back to list
      </button>
    </div>
  </div>
);
  // 🔍 Filter users by search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-musta-purple mb-6 text-center">👥 Find Friends</h1>

      {!selectedUser ? (
        <>
          <input
            type="text"
            placeholder="Search users by username..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full mb-6 px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredUsers.map(user => renderUserCard(user))}
          </div>
        </>
      ) : (
        renderProfile(selectedUser)
      )}
    </div>
  );
}