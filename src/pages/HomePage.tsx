import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Zap, 
  Shield, 
  Users, 
  Brain, 
  Folder, 
  Star, 
  TrendingUp,
  ArrowRight,
  GitBranch,
  MessageSquare
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { PasteCard } from '../components/Paste/PasteCard';

export const HomePage: React.FC = () => {
  const { pastes } = useAppStore();
  const { isAuthenticated } = useAuthStore();
  
  const recentPastes = pastes.slice(0, 6);

  const features = [
    {
      icon: Code2,
      title: 'Syntax Highlighting',
      description: 'Support for 200+ programming languages with beautiful syntax highlighting'
    },
    {
      icon: Folder,
      title: 'Project Management',
      description: 'Organize your code into projects with branches and collaboration features'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Get intelligent code summaries and smart content recommendations'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with real-time collaboration and communication tools'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Advanced security features with role-based access control'
    },
    {
      icon: GitBranch,
      title: 'Version Control',
      description: 'Track changes with comprehensive version history and diff viewing'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Code Snippets', value: '50,000+' },
    { label: 'Projects', value: '5,000+' },
    { label: 'Languages', value: '200+' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
            >
              The Ultimate{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Code Sharing
              </span>{' '}
              Platform
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed"
            >
              Share code snippets, manage projects, collaborate with teams, and leverage AI-powered insights. 
              Everything you need to build better software, together.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/create"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <Code2 className="h-5 w-5" />
                <span>Start Coding</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                to="/explore"
                className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 flex items-center space-x-2"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Explore</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features for Modern Development
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              From simple code sharing to enterprise-grade project management, 
              PasteForge has everything you need to streamline your development workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-xl group"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Pastes */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Recent Code Snippets
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Discover the latest code shared by our community
              </p>
            </div>
            <Link
              to="/explore"
              className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPastes.map((paste, index) => (
              <motion.div
                key={paste.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PasteCard paste={paste} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Start Building?
              </h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who use PasteForge to share code, 
                manage projects, and collaborate with their teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};