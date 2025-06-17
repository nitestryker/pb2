import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Clock, Star, Code, Users } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { PasteCard } from '../components/Paste/PasteCard';

export const ExplorePage: React.FC = () => {
  const { pastes, projects } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewType, setViewType] = useState<'pastes' | 'projects'>('pastes');

  const languages = useMemo(() => {
    const langs = new Set(pastes.map(paste => paste.language));
    return Array.from(langs).sort();
  }, [pastes]);

  const filteredAndSortedPastes = useMemo(() => {
    let filtered = pastes.filter(paste => {
      const matchesSearch = paste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paste.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paste.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLanguage = !selectedLanguage || paste.language === selectedLanguage;
      return matchesSearch && matchesLanguage && paste.isPublic;
    });

    switch (sortBy) {
      case 'recent':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popular':
        return filtered.sort((a, b) => b.views - a.views);
      case 'stars':
        return filtered.sort((a, b) => b.stars - a.stars);
      default:
        return filtered;
    }
  }, [pastes, searchTerm, selectedLanguage, sortBy]);

  const stats = [
    { label: 'Total Pastes', value: pastes.length, icon: Code },
    { label: 'Active Projects', value: projects.length, icon: Users },
    { label: 'Languages', value: languages.length, icon: TrendingUp }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Explore PasteForge
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Discover amazing code snippets and projects from our community
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center"
            >
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search pastes, projects, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="stars">Most Starred</option>
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">View:</span>
            <button
              onClick={() => setViewType('pastes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewType === 'pastes'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Pastes ({filteredAndSortedPastes.length})
            </button>
            <button
              onClick={() => setViewType('projects')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewType === 'projects'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Projects ({projects.length})
            </button>
          </div>
        </div>

        {/* Results */}
        {viewType === 'pastes' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {filteredAndSortedPastes.length} Pastes Found
              </h2>
            </div>

            {filteredAndSortedPastes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedPastes.map((paste, index) => (
                  <motion.div
                    key={paste.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PasteCard paste={paste} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-slate-400 dark:text-slate-500 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No pastes found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {projects.length} Projects
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>{project.stars}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{project.collaborators.length}</span>
                      </div>
                    </div>
                    <span className="text-xs">
                      by {project.author.username}
                    </span>
                  </div>

                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {project.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};