import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Folder, 
  Users, 
  Star, 
  GitBranch,
  Calendar,
  User,
  Settings
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';

export const ProjectsPage: React.FC = () => {
  const { projects } = useAppStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'owned' | 'collaborating'>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'owned' && project.author.id === user?.id) ||
                         (filter === 'collaborating' && project.collaborators.some(c => c.id === user?.id));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Projects
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Organize your code into collaborative projects
            </p>
          </div>
          
          <Link
            to="/create-project"
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 mt-4 sm:mt-0"
          >
            <Plus className="h-5 w-5" />
            <span>New Project</span>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('owned')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'owned'
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Owned
                </button>
                <button
                  onClick={() => setFilter('collaborating')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'collaborating'
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Collaborating
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Folder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {projects.filter(p => p.author.id === user?.id).length}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">
                  Owned Projects
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {projects.filter(p => p.collaborators.some(c => c.id === user?.id)).length}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">
                  Collaborating
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {projects.reduce((acc, p) => acc + p.stars, 0)}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">
                  Total Stars
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/project/${project.id}`}
                  className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      
                      {project.author.id === user?.id && (
                        <div className="ml-2">
                          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            <Settings className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{project.author.username}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <GitBranch className="h-4 w-4" />
                          <span>{project.branches.length}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4" />
                          <span>{project.stars}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{project.collaborators.length}</span>
                        </div>
                      </div>

                      <div className="flex -space-x-2">
                        {project.collaborators.slice(0, 3).map(collaborator => (
                          <div
                            key={collaborator.id}
                            className="relative"
                          >
                            {collaborator.avatar ? (
                              <img
                                src={collaborator.avatar}
                                alt={collaborator.username}
                                className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                <span className="text-xs text-white font-medium">
                                  {collaborator.username[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                        {project.collaborators.length > 3 && (
                          <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                              +{project.collaborators.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-md">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {project.isPublic && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                          Public
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <Folder className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
            </p>
            {!searchTerm && (
              <Link
                to="/create-project"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-5 w-5" />
                <span>Create Project</span>
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};