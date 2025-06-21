import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const EditProfile: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [tagline, setTagline] = useState('');
  const [website, setWebsite] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const data = await apiService.getEditableProfile(user.id);
        setTagline(data.tagline || '');
        setWebsite(data.website || '');
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    load();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    let profilePicture;
    if (file) {
      profilePicture = await toBase64(file);
    }
    try {
      await apiService.updateProfile(user.id, { tagline, website, profilePicture });
      updateProfile({ tagline, website, avatar: profilePicture ? '' : undefined });
      navigate(`/profile/${user.username}`);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <div>
          <label className="block mb-1 font-medium">Profile Picture</label>
          <input type="file" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Tagline</label>
          <input type="text" maxLength={100} value={tagline} onChange={e => setTagline(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Website</label>
          <input type="url" value={website} onChange={e => setWebsite(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
