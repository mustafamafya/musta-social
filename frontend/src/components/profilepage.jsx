import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function ProfilePage({ user, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6 animate-fadeIn">
      <img src={user.profile_img} alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <div className="flex justify-between">
        <button onClick={onUpdate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Update Info</button>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Delete Account</button>
      </div>

      {showModal && (
        <ConfirmModal
          message="Are you sure you want to delete your account?"
          onConfirm={onDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}