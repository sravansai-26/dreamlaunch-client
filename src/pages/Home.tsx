// src/pages/Home.tsx

import React, { useState } from 'react';
import {
  Play, Video, Sparkles, Image, Film, Camera, Upload, Users, TrendingUp, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom'; // Ensure this is imported at the top


const Home: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      openAuthModal('register');
    }
  };

  const handleWatchDemo = () => {
    setShowDemo(true);
  };

  const contentTypes = [
    { icon: Video, title: 'Teasers', description: 'Create exclusive teaser previews', color: 'text-blue-400' },
    { icon: Film, title: 'Trailers', description: 'Launch movie and show trailers', color: 'text-purple-400' },
    { icon: Image, title: 'Posters', description: 'Share stunning visual posters', color: 'text-green-400' },
    { icon: Camera, title: 'Videos', description: 'Upload and launch video content', color: 'text-yellow-400' },
  ];

  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Drag and drop your content with custom descriptions, hashtags, and locations'
    },
    {
      icon: Users,
      title: 'Exclusive Access',
      description: 'Share private previews with selected viewers before public launch'
    },
    {
      icon: Sparkles,
      title: 'Auto Launch',
      description: 'Automatically publish to YouTube, Instagram, and other platforms'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Track engagement, views, and performance across all platforms'
    }
  ];

  return (
    <div className="min-h-screen">

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">DreamLaunch Demo</h2>
              <button
                onClick={() => setShowDemo(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  controls
                  className="w-full h-full"
                  poster="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  See How DreamLaunch Works
                </h3>
                <p className="text-gray-300 mb-4">
                  Watch how creators upload, preview, and launch their content across social media platforms
                </p>
                {!isAuthenticated && (
                  <button
                    onClick={handleGetStarted}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Start Creating Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {isAuthenticated ? (
            <>
              <h1 className="text-5xl font-bold text-white mb-4">Welcome Back 🎉</h1>
              <p className="text-lg text-gray-300 mb-6">
                You’re logged in! Start creating your next teaser, trailer, or poster.
              </p>
             <div className="flex justify-center gap-4 mb-12">
  <Link
    to="/create"
    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all"
  >
    Create New Content
  </Link>
  <Link
    to="/dashboard"
    className="px-6 py-3 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
  >
    Go to Dashboard
  </Link>
</div>


            </>
          ) : (
            <>
              <div className="mb-8">
                <Sparkles className="h-20 w-20 text-yellow-400 mx-auto mb-6 animate-pulse" />
                <h1 className="text-6xl font-bold text-white mb-6">
                  Launch Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                    {' '}Creative Dreams
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  The ultimate platform for creators and producers to launch teasers, trailers, posters,
                  and videos with exclusive previews and automated social media publishing.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                </button>
                <button
                  onClick={handleWatchDemo}
                  className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-full text-lg transition-all duration-300 hover:bg-white/10"
                >
                  <Play className="h-5 w-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </>
          )}

          {/* Content Types */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {contentTypes.map((type, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <type.icon className={`h-12 w-12 ${type.color} mx-auto mb-4`} />
                <h3 className="text-xl font-semibold text-white mb-2">{type.title}</h3>
                <p className="text-gray-300 text-sm">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Launch Successfully
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From creation to launch, we provide all the tools you need to share your content with the world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {isAuthenticated ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-4">🚀 Pro Tip for Creators</h2>
              <p className="text-lg text-gray-300 mb-4">
                Want to go viral? Use trending hashtags and time your teaser launches for maximum reach. Track all your launch data in the Dashboard.
              </p>
              <Link
  to="/dashboard"
  className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
>
  Open Dashboard
</Link>

            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-12 border border-white/10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Launch Your Next Project?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of creators who trust DreamLaunch for their content launches.
              </p>
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Creating Now
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-16">
        <div className="text-center text-gray-400 text-sm space-y-2">
          <p>&copy; 2025 <span className="text-white font-semibold">DreamLaunch</span>. Built for creators, by creators.</p>
          <div className="flex justify-center space-x-4">
            <a href="/privacy-policy" className="hover:text-white underline transition">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-white underline transition">Terms of Service</a>
          </div>
          <p>Developed by <span className="text-white font-bold">LYFSpot</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
