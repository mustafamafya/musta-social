import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../api/user';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    age: '',
    address: '',
    image: null
  });
  const navigate = useNavigate();

  // Load current user
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return navigate('/login');
    getUserInfo(token)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch user info:', err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading)
    return (
      <div className="text-center mt-10 text-musta-purple">
        Loading profile...
      </div>
    );
  if (!user)
    return (
      <div className="text-center mt-10 text-red-500">User not found</div>
    );

  // Enter edit mode, seed form with current user values
  const handleEditClick = () => {
    setForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      gender: user.gender || '',
      age: user.age?.toString() || '',
      address: user.address || '',
      image: null
    });
    setEditMode(true);
  };

  // Handle form field changes
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Save updates to the server
  const handleSave = async e => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) return navigate('/login');

    const payload = new FormData();
    payload.append('first_name', form.first_name);
    payload.append('last_name', form.last_name);
    payload.append('gender', form.gender);
    payload.append('age', form.age);
    payload.append('address', form.address);
    if (form.image) {
      payload.append('profile_img', form.image);
    }

    try {
      const res = await fetch('http://localhost:8000/api/v1/user-info/', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: payload
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setUser(updated);
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-musta-bg rounded-2xl shadow-xl border border-musta-purple space-y-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-2 animate-pulse">
        Musta Social
      </h1>

      {/* View Mode */}
      {!editMode && (
        <>
          <div className="flex flex-col items-center space-y-3">
            <img
              src={`http://localhost:8000${user.profile_img}`}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-musta-purple shadow-md"
            />
            <h2 className="text-xl font-semibold text-red-800 animate-pulse">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div>
              <span className="font-semibold text-musta-purple">Followers:</span>{' '}
              <span className="animate-pulse text-red-500 font-bold">
                {user.followers_count || 0}
              </span>
            </div>
            <div>
              <span className="font-semibold text-musta-purple">Following:</span>{' '}
              <span className="animate-pulse text-green-500 font-bold">
                {user.following_count || 0}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-semibold text-musta-purple">Gender:</span>{' '}
              {user.gender || '—'}
            </div>
            <div>
              <span className="font-semibold text-musta-purple">Age:</span>{' '}
              {user.age || '—'}
            </div>
            <div className="col-span-2">
              <span className="font-semibold text-musta-purple">Address:</span>{' '}
              {user.address || '—'}
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <button
              onClick={handleEditClick}
              className="px-5 py-2.5 bg-blue-500 text-black font-semibold rounded-lg shadow-md hover:bg-green-300 hover:shadow-lg transition duration-300 ease-in-out"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-gray-100 text-gray-800 font-medium rounded-lg shadow-sm hover:bg-gray-200 hover:shadow-md transition duration-300 ease-in-out"
            >
              Logout
            </button>
          </div>
        </>
      )}

      {/* Edit Mode */}
      {editMode && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col text-sm">
              First Name
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="mt-1 p-2 border rounded"
              />
            </label>
            <label className="flex flex-col text-sm">
              Last Name
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="mt-1 p-2 border rounded"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <label className="flex flex-col">
              Gender
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="mt-1 p-2 border rounded"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="flex flex-col">
              Age
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="mt-1 p-2 border rounded"
              />
            </label>
          </div>

          <label className="flex flex-col text-sm">
            Address
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-1 p-2 border rounded"
            />
          </label>

          <label className="flex flex-col text-sm">
            Profile Image
            <input
              type="file"
              accept="image/*"
              onChange={e =>
                setForm(prev => ({ ...prev, image: e.target.files[0] }))
              }
              className="mt-1 p-2 border rounded"
            />
          </label>

          <div className="flex justify-center space-x-4 pt-4">
            <button
              type="submit"
              className="px-5 py-2.5 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-300 transition duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}