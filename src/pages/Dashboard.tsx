import { useState, useEffect, useCallback, FC } from 'react';
import {
  Plus,
  Eye,
  Calendar,
  TrendingUp,
  Video,
  Image,
  Film,
  Camera,
  Play,
  Trash2, // Added Trash2 icon for delete
  // ExternalLink, // REMOVED: Redundant icon
  LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth, api } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog'; // Import ConfirmDialog component

// --- TYPE DEFINITIONS --- //

interface Content {
  _id: string;
  title: string;
  description: string;
  mediaType: 'teaser' | 'trailer' | 'poster' | 'video' | 'image';
  mediaUrl: string;
  thumbnailUrl?: string;
  hashtags: string[];
  location?: string;
  isViewed: boolean;
  viewCount: number;
  isLaunched: boolean;
  socialPlatforms: {
    youtube?: { published: boolean; publishedAt?: string };
    instagram?: { published: boolean; publishedAt?: string };
    twitter?: { published: boolean; publishedAt?: string };
  };
  createdAt: string;
  user: { // User field for ownership check
    _id: string;
    username: string;
    fullName: string;
  };
  // NEW: Assuming backend will populate this from the latest LaunchRecord
  latestLaunch?: {
    _id: string; // Add _id for the populated LaunchRecord
    launchedByName: string;
    launchedAt: string; // Add launchedAt if you want to display it
    // Add other relevant LaunchRecord fields if needed
  };
}

type FilterType = 'all' | 'teaser' | 'trailer' | 'poster' | 'video' | 'image';

interface StatCardProps {
  label: string;
  value: string | number;
  Icon: LucideIcon;
  color: string;
}

// --- HELPER COMPONENTS --- //

const StatCard: FC<StatCardProps> = ({ label, value, Icon, color }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-300 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <Icon className={`h-8 w-8 ${color}`} />
    </div>
  </div>
);

const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const EmptyState: FC = () => (
  <div className="text-center py-12">
    <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">No content yet</h3>
    <p className="text-gray-300 mb-6">Create your first content to get started</p>
    <Link
      to="/create"
      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
    >
      <Plus className="h-5 w-5" />
      <span>Create Content</span>
    </Link>
  </div>
);

// --- MAIN DASHBOARD COMPONENT --- //

const Dashboard: FC = () => {
  const { user, isAuthenticated, openAuthModal, isLoading: authLoading } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [contentToDeleteId, setContentToDeleteId] = useState<string | null>(null);

  // Helper to get full media URL (re-added for direct use here)
  const getFullMediaUrl = useCallback((relativePath: string | undefined): string => {
    if (!relativePath) return '';
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
    // Ensure VITE_API_BASE_URL is correctly defined and ends without a slash, and relativePath starts with one
    // Example: VITE_API_BASE_URL="http://localhost:5000/api" and relativePath="/uploads/image.jpg"
    // Or if VITE_API_BASE_URL="http://localhost:5000", then relativePath should be "/api/uploads/image.jpg"
    // Adjust based on your server's static file serving setup.
    return `${import.meta.env.VITE_API_BASE_URL}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
  }, []);

  const fetchContents = useCallback(async () => {
    setIsLoading(true);
    try {
      // You'll need to ensure your backend's GET /v1/content endpoint
      // populates or includes the 'launchedByName' (e.g., as 'latestLaunch')
      const response = await api.get<{ data: Content[] }>('/v1/content');

      if (Array.isArray(response.data?.data)) {
        setContents(response.data.data);
      } else {
        throw new Error("Invalid data format from server");
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
      toast.error('Failed to fetch your content. Please try again.');
      setContents([]); // Ensure contents is an empty array on failure
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        openAuthModal('login');
        setIsLoading(false);
      } else {
        fetchContents();
      }
    }
  }, [isAuthenticated, openAuthModal, fetchContents, authLoading]);

  const handleDeleteClick = (contentId: string) => {
    setContentToDeleteId(contentId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!contentToDeleteId) return;

    try {
      await api.delete(`/v1/content/${contentToDeleteId}`);
      toast.success('Content deleted successfully!');
      setContents(prevContents => prevContents.filter(c => c._id !== contentToDeleteId));
    } catch (error: any) {
      console.error('Error deleting content:', error);
      const message = error.response?.data?.message || 'Failed to delete content.';
      toast.error(message);
    } finally {
      setShowConfirmDialog(false);
      setContentToDeleteId(null);
    }
  };

  const getContentIcon = (type: Content['mediaType']): LucideIcon => {
    const iconMap: Record<Content['mediaType'], LucideIcon> = {
      teaser: Video,
      trailer: Film,
      poster: Image,
      video: Camera,
      image: Image,
    };
    return iconMap[type] || Video;
  };

  const getContentColor = (type: Content['mediaType']): string => {
    const colorMap: Record<Content['mediaType'], string> = {
      teaser: 'text-blue-400',
      trailer: 'text-purple-400',
      poster: 'text-green-400',
      video: 'text-yellow-400',
      image: 'text-pink-400',
    };
    return colorMap[type] || 'text-blue-400';
  };

  const getPublishStatus = (content: Content): 'Pending' | 'Partial' | 'Complete' => {
    const platforms = content.socialPlatforms || {};
    // Filter only platforms that are explicitly defined (not undefined/null)
    const enabledPlatforms = Object.values(platforms).filter(p => p);
    const publishedCount = enabledPlatforms.filter(p => p && p.published).length; // Check p exists before .published

    if (enabledPlatforms.length === 0 || publishedCount === 0) return 'Pending';
    if (publishedCount === enabledPlatforms.length) return 'Complete';
    return 'Partial';
  };

  const getStatusColor = (status: 'Pending' | 'Partial' | 'Complete'): string => {
    switch (status) {
      case 'Complete': return 'text-green-400';
      case 'Partial': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const filteredContents = filter === 'all'
    ? contents
    : contents.filter(content => content.mediaType === filter);

  const stats = {
    total: contents.length,
    viewed: contents.filter(c => c.isViewed).length,
    launched: contents.filter(c => c.isLaunched).length,
    totalViews: contents.reduce((sum, c) => sum + c.viewCount, 0)
  };

  if (!isAuthenticated && !isLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-white">Please log in to view the dashboard.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300">Manage your content launches and track performance</p>
        </div>
        <Link
          to="/create"
          className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span>Create New</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Content" value={stats.total} Icon={Video} color="text-blue-400" />
        <StatCard label="Viewed" value={stats.viewed} Icon={Eye} color="text-green-400" />
        <StatCard label="Launched" value={stats.launched} Icon={TrendingUp} color="text-purple-400" />
        <StatCard label="Total Views" value={stats.totalViews.toLocaleString()} Icon={Calendar} color="text-yellow-400" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'teaser', 'trailer', 'poster', 'video', 'image'] as FilterType[]).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
              filter === type
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : filteredContents.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => {
            // --- ADDED CONSOLE LOGS FOR DEBUGGING ---
            console.log("Content object in Dashboard:", content);
            console.log("latestLaunch for this content:", content.latestLaunch);
            // --- END CONSOLE LOGS ---

            const IconComponent = getContentIcon(content.mediaType);
            const iconColor = getContentColor(content.mediaType);
            const publishStatus = getPublishStatus(content);

            const isOwner = user ? content.user._id === user.id : false;

            return (
              <div
                key={content._id}
                className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-48 bg-gray-800">
                  {content.thumbnailUrl ? (
                    <img src={getFullMediaUrl(content.thumbnailUrl)} alt={content.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconComponent className={`h-16 w-16 ${iconColor}`} />
                    </div>
                  )}
                  {(content.mediaType === 'teaser' || content.mediaType === 'trailer' || content.mediaType === 'video') && (
                    <Link to={`/content/${content._id}`} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                      <Play className="h-12 w-12 text-white" />
                    </Link>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${iconColor} bg-black/50`}>
                      {content.mediaType}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(publishStatus)} bg-black/50`}>
                      {publishStatus} Publish
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{content.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{content.description}</p>

                  {/* NEW: Display Launched By Name */}
                  {content.latestLaunch?.launchedByName && (
                    <p className="text-gray-400 text-sm mb-2">
                      Launched by: <strong className="text-white">{content.latestLaunch.launchedByName}</strong>
                      {content.latestLaunch.launchedAt && (
                          <span className="ml-2">on {new Date(content.latestLaunch.launchedAt).toLocaleDateString()}</span>
                      )}
                    </p>
                  )}

                  {content.hashtags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {content.hashtags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {content.hashtags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                          +{content.hashtags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{content.viewCount.toLocaleString()} views</span>
                    </span>
                    <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Link
                      to={`/content/${content._id}`}
                      className="flex-1 text-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      View Details
                    </Link>
                    {/* REMOVED: Redundant ExternalLink icon and its functionality */}
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteClick(content._id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors duration-200"
                        title="Delete Content"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this content? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;