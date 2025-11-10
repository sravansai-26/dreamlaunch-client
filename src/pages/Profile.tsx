import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Save,
  Edit3,
  Camera,
  Youtube
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth, api } from '../contexts/AuthContext'; // IMPORT 'api' FROM AUTHCONTEXT
import toast from 'react-hot-toast';
// Removed: import axios from 'axios'; as we'll use the 'api' instance

interface ProfileForm {
  fullName: string;
  bio: string;
  location: string; // Add location to form interface
  website: string;  // Add website to form interface
  socialLinks: {
    youtube: string;
    instagram: string;
    twitter: string;
  };
}

const Profile: React.FC = () => {
  const { user, isAuthenticated, openAuthModal, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectingYouTube, setIsConnectingYouTube] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      location: user?.location || '', // Initialize location from user
      website: user?.website || '',   // Initialize website from user
      socialLinks: {
        youtube: user?.socialLinks?.youtube || '',
        instagram: user?.socialLinks?.instagram || '',
        twitter: user?.socialLinks?.twitter || ''
      }
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal('login');
    }
  }, [isAuthenticated, openAuthModal]);

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        bio: user.bio || '',
        location: user.location || '', // Reset location
        website: user.website || '',   // Reset website
        socialLinks: {
          youtube: user.socialLinks?.youtube || '',
          instagram: user.socialLinks?.instagram || '',
          twitter: user.socialLinks?.twitter || ''
        }
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      // Pass the entire data object. updateProfile in AuthContext needs to handle these.
      await updateProfile(data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error); // Log for more details
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset(); // Reset form to current user data
    setIsEditing(false);
  };

  const handleConnectYouTube = async () => {
    setIsConnectingYouTube(true);
    try {
      // --- FIX: Use the 'api' instance from AuthContext for authenticated requests ---
      const response = await api.get('/auth/youtube/connect');
      const authUrl = response.data.authUrl;

      window.location.href = authUrl;
    } catch (error: any) {
      console.error('Error initiating YouTube connect:', error.response?.data?.message || error.message);
      toast.error('Failed to connect to YouTube. Please try again.');
    } finally {
      setIsConnectingYouTube(false);
    }
  };

  // If user is null or not authenticated, don't render anything yet
  if (!isAuthenticated || !user) {
    // Optionally render a loading spinner or a message here if user is not yet loaded/authenticated
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
            <p className="text-gray-300">Manage your account settings and preferences</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card (Display only) */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 p-2 bg-gray-800 hover:bg-gray-700 rounded-full border-2 border-white/20">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">{user.fullName}</h2>
              <p className="text-gray-300 mb-4">@{user.username}</p>
              {user.bio && <p className="text-gray-300 text-sm mb-6">{user.bio}</p>}

              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {/* Display Location if available */}
                {user.location && (
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {/* Display Website if available */}
                {user.website && (
                  <div className="flex items-center justify-center space-x-2">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {user.website.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form (Editable) */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        {...register('fullName', { required: 'Full name is required' })}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={user.username}
                      disabled
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white opacity-50"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    {...register('bio')}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        {...register('location')}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                        placeholder="Your location"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        {...register('website')}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Social Links</h3>
                <div className="space-y-4">
                  {(['youtube', 'instagram', 'twitter'] as const).map((platform) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)} Profile
                      </label>
                      <input
                        type="url"
                        {...register(`socialLinks.${platform}`)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                        placeholder={`https://${platform}.com/yourusername`}
                      />
                    </div>
                  ))}
                </div>

                {/* Added: Connect YouTube Channel Button Section */}
                {isEditing && (
                  <div className="mt-6 border-t border-gray-700 pt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Automated Publishing Integrations
                    </label>
                    <button
                      type="button"
                      onClick={handleConnectYouTube}
                      disabled={isConnectingYouTube || user?.youtubeConnected} // Disable if already connected
                      className="flex items-center space-x-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Youtube className="h-5 w-5" />
                      <span>{isConnectingYouTube ? 'Connecting...' : (user?.youtubeConnected ? 'YouTube Connected' : 'Connect YouTube Channel')}</span> {/* Dynamic text */}
                    </button>
                    {user?.youtubeConnected ? (
                      <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                        ✅ YouTube Connected
                        {/* Corrected YouTube channel link display */}
                        {user.socialLinks?.youtube && (
                          <>
                            <LinkIcon className="h-3 w-3 inline-block" />
                            <a href={user.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300">
                              View Channel
                            </a>
                          </>
                        )}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm mt-2">
                        ❌ YouTube Not Connected (Connect to enable auto-publishing for your content)
                      </p>
                    )}
                  </div>
                )}
                {/* End Added Section */}

              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;