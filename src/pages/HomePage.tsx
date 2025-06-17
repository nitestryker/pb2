import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Zap, 
  Shield, 
  Users, 
  Clock, 
  Star,
  ArrowRight,
  Plus,
  TrendingUp,
  Globe
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface Paste {
  id: number;
  title: string;
  syntax_language: string;
  author: {
    username: string;
  };
  created_at: string;
  view_count: number;
}

const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const [recentPastes, setRecentPastes] = useState<Paste[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPastes = async () => {
      try {
        const response = await apiService.getRecentPastes(6);
        setRecentPastes(response.pastes || []);
      } catch (error) {
        console.error('Failed to fetch recent pastes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPastes();
  }, []);

  const features = [
    {
      icon: Code2,
      title: 'Syntax Highlighting',
      description: 'Support for 200+ programming languages with beautiful syntax highlighting'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance for instant loading and smooth user experience'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Zero-knowledge encryption for sensitive code with client-side security'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Share and collaborate on code projects with team members'
    },
    {
      icon: Clock,
      title: 'Version Control',
      description: 'Track changes and manage different versions of your code snippets'
    },
    {
      icon: Globe,
      title: 'Public Archive',
      description: 'Discover and learn from a vast collection of public code snippets'
    }
  ];

  const stats = [
    { label: 'Code Snippets', value: '50K+', icon: Code2 },
    { label: 'Active Users', value: '10K+', icon: Users },
    { label: 'Languages', value: '200+', icon: Star },
    { label: 'Daily Views', value: '100K+', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Share Code
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}Beautifully
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              PasteForge is the modern pastebin platform for developers. Share, collaborate, 
              and manage your code snippets with advanced features and beautiful syntax highlighting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Paste
              </Link>
              <Link
                to="/archive"
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Browse Archive
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to share, manage, and collaborate on code snippets
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Pastes Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Pastes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the latest code snippets shared by our community
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : recentPastes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPastes.map((paste, index) => (
                <motion.div
                  key={paste.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    to={`/paste/${paste.id}`}
                    className="block bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                      {paste.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {paste.syntax_language}
                      </span>
                      <span>{paste.view_count} views</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>by {paste.author?.username || 'Anonymous'}</span>
                      <span>{new Date(paste.created_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Code2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No recent pastes available
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/archive"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              View All Pastes
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of developers who trust PasteForge for their code sharing needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Sign Up Free
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;