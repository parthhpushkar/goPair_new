'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiStar,
  FiCalendar,
  FiShield,
  FiEdit2,
  FiSave,
  FiPlus,
  FiTruck,
} from 'react-icons/fi';
import { formatDate, getInitials } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StarRating from '@/components/ui/StarRating';
import Modal from '@/components/ui/Modal';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', bio: '' });
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    plate: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (session) fetchProfile();
  }, [session, status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      setProfile(data);
      setEditForm({
        name: data.name || '',
        phone: data.phone || '',
        bio: data.bio || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        toast.success('Profile updated!');
        setEditing(false);
        fetchProfile();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleAddVehicle = async () => {
    try {
      const res = await fetch('/api/user/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleForm),
      });
      if (res.ok) {
        toast.success('Vehicle added!');
        setVehicleModalOpen(false);
        setVehicleForm({ make: '', model: '', year: '', color: '', plate: '' });
        fetchProfile();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to add vehicle');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;
  if (!profile) return null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Header */}
          <div className="glass-card p-8 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white shadow-neon">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  getInitials(profile.name || 'U')
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                  {profile.verified && <FiShield className="text-primary-400" />}
                </div>
                <p className="text-gray-400 text-sm">{profile.email}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <FiStar className="text-yellow-400" />
                    <span>{profile.rating.toFixed(1)} rating</span>
                  </div>
                  <span>•</span>
                  <span>{profile._count.ridesOffered} rides offered</span>
                  <span>•</span>
                  <span>{profile._count.bookings} rides taken</span>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="glass-button-secondary text-sm py-2 px-4"
              >
                <FiEdit2 /> {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Edit Form */}
          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass-card p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Edit Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="glass-input"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="glass-input min-h-[80px]"
                    placeholder="Tell others about yourself..."
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="glass-button py-2.5 text-sm"
                >
                  <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiUser className="text-primary-400" /> Personal Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FiMail className="text-gray-500" />
                  <span className="text-sm text-gray-300">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-gray-500" />
                  <span className="text-sm text-gray-300">
                    {profile.phone || 'Not provided'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-gray-500" />
                  <span className="text-sm text-gray-300">
                    Joined {formatDate(profile.createdAt)}
                  </span>
                </div>
              </div>
              {profile.bio && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-sm text-gray-400">{profile.bio}</p>
                </div>
              )}
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiStar className="text-yellow-400" /> Stats & Reviews
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Overall Rating</p>
                  <div className="flex items-center gap-3">
                    <StarRating rating={Math.round(profile.rating)} size="md" />
                    <span className="text-lg font-bold text-white">
                      {profile.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-2xl font-bold text-white">{profile._count.ridesOffered}</p>
                    <p className="text-xs text-gray-400">Rides Offered</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{profile._count.bookings}</p>
                    <p className="text-xs text-gray-400">Rides Taken</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{profile._count.reviewsReceived}</p>
                    <p className="text-xs text-gray-400">Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicles */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FiTruck className="text-primary-400" /> My Vehicles
              </h3>
              <button
                onClick={() => setVehicleModalOpen(true)}
                className="glass-button-secondary text-sm py-2 px-4"
              >
                <FiPlus /> Add Vehicle
              </button>
            </div>

            {profile.vehicles?.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-3">
                {profile.vehicles.map((v: any) => (
                  <div key={v.id} className="glass p-4">
                    <p className="font-medium text-white">
                      {v.color} {v.make} {v.model}
                    </p>
                    <p className="text-sm text-gray-400">
                      {v.year} • Plate: {v.plate}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm py-6">
                No vehicles added yet
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        title="Add a Vehicle"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Make</label>
              <input
                type="text"
                value={vehicleForm.make}
                onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                className="glass-input"
                placeholder="Toyota"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Model</label>
              <input
                type="text"
                value={vehicleForm.model}
                onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                className="glass-input"
                placeholder="Innova"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Year</label>
              <input
                type="number"
                value={vehicleForm.year}
                onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                className="glass-input"
                placeholder="2023"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Color</label>
              <input
                type="text"
                value={vehicleForm.color}
                onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                className="glass-input"
                placeholder="White"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Plate</label>
              <input
                type="text"
                value={vehicleForm.plate}
                onChange={(e) => setVehicleForm({ ...vehicleForm, plate: e.target.value })}
                className="glass-input"
                placeholder="DL 01 AB 1234"
              />
            </div>
          </div>
          <button onClick={handleAddVehicle} className="glass-button w-full py-3">
            Add Vehicle
          </button>
        </div>
      </Modal>
    </div>
  );
}
