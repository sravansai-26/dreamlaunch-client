import React, { useState, useEffect, useCallback } from 'react';
import {
  Video, Image, Film, Camera, Hash, MapPin, Calendar, Eye, UploadCloud, Loader2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth, api } from '../contexts/AuthContext'; // <<< CHANGE HERE
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import type { LucideIcon } from 'lucide-react';

interface ContentForm {
  title: string;
  description: string;
  contentType: 'teaser' | 'trailer' | 'poster' | 'video' | 'image';
  mediaUrl: string;
  thumbnailUrl?: string;
  hashtags: string;
  location?: string;
  scheduledDate?: string;
  isPrivate: boolean;
  socialPlatforms: {
    youtube: boolean;
    instagram: boolean;
    twitter: boolean;
  };
}

const MAX_TITLE = 100;
const MAX_DESCRIPTION = 500;

const CreateContent: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContentForm>({
    defaultValues: {
      contentType: 'teaser',
      isPrivate: false,
      socialPlatforms: {
        youtube: true,
        instagram: true,
        twitter: false,
      },
    },
  });

  const contentType = watch('contentType');
  const mediaUrl = watch('mediaUrl');
  const thumbnailUrl = watch('thumbnailUrl');
  const title = watch('title') || '';
  const description = watch('description') || '';

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal('login');
    }
  }, [isAuthenticated, openAuthModal]);

  useEffect(() => {
    if (mediaFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPreviewUrl(reader.result.toString());
        }
      };
      reader.readAsDataURL(mediaFile);
    } else if (mediaUrl) {
      setPreviewUrl(mediaUrl);
    } else {
      setPreviewUrl('');
    }
  }, [mediaUrl, mediaFile, setValue]);

  useEffect(() => {
    if (thumbnailUrl) {
      setThumbnailPreview(thumbnailUrl);
    } else {
      setThumbnailPreview('');
    }
  }, [thumbnailUrl]);

  const contentTypes: { value: ContentForm['contentType']; label: string; icon: LucideIcon; color: string }[] = [
    { value: 'teaser', label: 'Teaser', icon: Video, color: 'text-blue-400' },
    { value: 'trailer', label: 'Trailer', icon: Film, color: 'text-purple-400' },
    { value: 'poster', label: 'Poster', icon: Image, color: 'text-green-400' },
    { value: 'video', label: 'Video', icon: Camera, color: 'text-yellow-400' },
    { value: 'image', label: 'Image', icon: Image, color: 'text-pink-400' },
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setMediaFile(file);
      setValue('mediaUrl', '', { shouldValidate: true });
    }
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
    },
    multiple: false,
  });

  const onSubmit = async (data: ContentForm) => {
    setIsLoading(true);
    try {
      if (!mediaFile && !data.mediaUrl) {
        toast.error('Please provide a Media URL or upload a file.');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('contentType', data.contentType);
      formData.append('hashtags', data.hashtags);
      if (data.location) formData.append('location', data.location);
      formData.append('isPrivate', String(data.isPrivate));
      if (data.scheduledDate) formData.append('scheduledDate', data.scheduledDate);
      
      formData.append('socialPlatforms', JSON.stringify(data.socialPlatforms));

      if (mediaFile) {
        formData.append('file', mediaFile);
      } else {
        formData.append('mediaUrl', data.mediaUrl);
      }

      if (data.thumbnailUrl) {
        formData.append('thumbnailUrl', data.thumbnailUrl);
      }
      
      toast.loading('Creating content and uploading media...');

      // <<< CHANGE HERE: Use 'api' client and correct endpoint '/v1/content'
      const response = await api.post('/v1/content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.dismiss();
      toast.success('Content created successfully!');
      navigate(`/content/${response.data.data._id}`);
    } catch (error: any) {
      toast.dismiss();
      const message = error.response?.data?.message || 'Failed to create content';
      console.error("Error creating content:", error.response?.data || error.message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-700">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Create New Content</h1>
          <p className="text-gray-400 text-lg">Upload and configure your content for seamless launch</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Content Type */}
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-7 border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-5 flex items-center">
              <Film className="h-6 w-6 mr-3 text-blue-400" />
              Content Type
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              {contentTypes.map(type => {
                const IconComponent = type.icon;
                return (
                  <label key={type.value} className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 shadow-md ${
                    contentType === type.value
                      ? 'border-blue-500 bg-blue-500/30 ring-2 ring-blue-500'
                      : 'border-gray-600 hover:border-blue-400 bg-gray-700/40'
                  }`}>
                    <input
                      type="radio"
                      value={type.value}
                      {...register('contentType')}
                      className="sr-only"
                    />
                    <IconComponent className={`h-9 w-9 mx-auto mb-3 ${type.color} transition-colors duration-300`} />
                    <span className="text-white font-semibold text-lg">{type.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-7 border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-5 flex items-center">
              <Hash className="h-6 w-6 mr-3 text-purple-400" />
              Basic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-7">
              <div>
                <label htmlFor="title" className="text-sm font-medium text-gray-300 block mb-2">Title <span className="text-red-400">*</span></label>
                <input
                  id="title"
                  type="text"
                  {...register('title', { required: 'Title is required', maxLength: MAX_TITLE })}
                  className={`w-full p-3.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Enter content title"
                />
                <p className={`text-xs mt-2 ${title.length > MAX_TITLE ? 'text-red-400' : 'text-gray-400'}`}>
                  {title.length}/{MAX_TITLE} characters
                </p>
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label htmlFor="location" className="text-sm font-medium text-gray-300 block mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="location"
                    type="text"
                    {...register('location')}
                    className="w-full p-3.5 pl-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    placeholder="Add location (e.g., New York, NY)"
                  />
                </div>
              </div>
            </div>

            <div className="mt-7">
              <label htmlFor="description" className="text-sm font-medium text-gray-300 block mb-2">Description <span className="text-red-400">*</span></label>
              <textarea
                id="description"
                {...register('description', { required: 'Description is required', maxLength: MAX_DESCRIPTION })}
                rows={5}
                className={`w-full p-3.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm resize-y ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your content in detail..."
              />
              <p className={`text-xs mt-2 ${description.length > MAX_DESCRIPTION ? 'text-red-400' : 'text-gray-400'}`}>
                {description.length}/{MAX_DESCRIPTION} characters
              </p>
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="mt-7">
              <label htmlFor="hashtags" className="text-sm font-medium text-gray-300 block mb-2">Hashtags</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="hashtags"
                  type="text"
                  {...register('hashtags')}
                  className="w-full p-3.5 pl-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="e.g., #trending, #viral, #newrelease"
                />
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-7 border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-5 flex items-center">
              <UploadCloud className="h-6 w-6 mr-3 text-green-400" />
              Media Upload
            </h2>

            <div className="grid md:grid-cols-2 gap-7">
              <div>
                <label htmlFor="mediaUrl" className="text-sm font-medium text-gray-300 block mb-2">Media URL</label>
                <input
                  id="mediaUrl"
                  type="url"
                  {...register('mediaUrl')}
                  className={`w-full p-3.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm ${mediaFile ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="https://example.com/media.mp4"
                  disabled={!!mediaFile}
                />
                  {mediaFile && <p className="text-gray-400 text-sm mt-2">URL input disabled when file is selected.</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Or Upload Media</label>
                <div {...getRootProps()} className={`relative cursor-pointer border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 group ${isDragActive ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-blue-400 bg-gray-700/40'}`}>
                  <input {...getInputProps()} />
                  <UploadCloud className={`mx-auto mb-3 h-8 w-8 text-gray-400 group-hover:text-blue-300 transition-colors duration-300 ${isDragActive ? 'text-blue-300' : ''}`} />
                  <p className="text-gray-300 font-medium text-lg">{isDragActive ? 'Drop the files here...' : 'Drag & drop files or click to browse'}</p>
                  <p className="text-gray-500 text-sm mt-1">Images (JPG, PNG) or Videos (MP4, MOV)</p>
                </div>
                {mediaFile && (
                  <p className="text-gray-300 mt-3 text-sm flex items-center">
                    <Film className="h-4 w-4 mr-2 text-blue-400" />
                    Selected file: <span className="font-medium ml-1 text-white">{mediaFile.name}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-7">
              <label htmlFor="thumbnailUrl" className="text-sm font-medium text-gray-300 block mb-2">Thumbnail URL</label>
              <input
                id="thumbnailUrl"
                type="url"
                {...register('thumbnailUrl')}
                className="w-full p-3.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                placeholder="https://example.com/thumb.jpg (optional)"
              />
              {thumbnailPreview && (
                <div className="mt-5 p-4 bg-gray-700 rounded-lg shadow-inner">
                  <p className="text-gray-300 mb-2 font-medium">Thumbnail Preview:</p>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="h-56 w-full object-cover rounded-lg border border-gray-600 shadow-md"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image'; }}
                  />
                </div>
              )}
            </div>

            {previewUrl && (
              <div className="mt-7 p-4 bg-gray-700 rounded-lg shadow-inner">
                <label className="text-sm font-medium text-gray-300 block mb-2">Media Preview</label>
                <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-600 shadow-md">
                  {['teaser', 'trailer', 'video'].includes(contentType) ? (
                    <video src={previewUrl} className="w-full h-72 object-contain" controls autoPlay loop muted />
                  ) : (
                    <img src={previewUrl} alt="Media Preview" className="w-full h-72 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Invalid+Media'; }} />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Launch Settings */}
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-7 border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-5 flex items-center">
              <Calendar className="h-6 w-6 mr-3 text-orange-400" />
              Launch Settings
            </h2>
            <div className="grid md:grid-cols-2 gap-7">
              <div>
                <label htmlFor="scheduledDate" className="text-sm font-medium text-gray-300 block mb-2">Scheduled Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="scheduledDate"
                    type="datetime-local"
                    {...register('scheduledDate')}
                    className="w-full p-3.5 pl-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex items-center pt-8 md:pt-0">
                <label htmlFor="isPrivate" className="flex items-center gap-3 cursor-pointer">
                  <input
                    id="isPrivate"
                    type="checkbox"
                    {...register('isPrivate')}
                    className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 transition-colors duration-200"
                  />
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-gray-400" />
                    <span className="text-white font-medium text-lg">Private Preview</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-7">
              <label className="block text-sm font-medium text-gray-300 mb-4">Auto-publish to platforms</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(['youtube', 'instagram', 'twitter'] as const).map(platform => (
                  <label key={platform} className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-lg cursor-pointer hover:bg-gray-600/70 transition-colors duration-200">
                    <input
                      type="checkbox"
                      {...register(`socialPlatforms.${platform}`)}
                      className="form-checkbox h-5 w-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white capitalize text-lg">{platform}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit & Cancel */}
          <div className="flex justify-end gap-5 pt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-7 py-3 bg-gray-700 border border-gray-600 text-gray-300 font-semibold rounded-xl hover:bg-gray-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin text-white" />}
              {isLoading ? 'Creating Content...' : 'Create Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContent;