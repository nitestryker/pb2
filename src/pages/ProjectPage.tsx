import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  GitBranch, 
  Users, 
  Calendar, 
  User,
  Eye,
  Settings,
  Plus,
  Book,
  Bug,
  Target
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatDistanceToNow } from 'date-fns';

export const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useAppStore();
  
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Project not found
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            The project you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                  {project.name}
                </h1>
                {project.isPublic && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
                    Public
                  </span>
                )}
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 text-lg mb-4">
                {project.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>by</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {project.author.username}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <Eye className="h-4 w-4" />
                <span>Watch</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <Star className="h-4 w-4" />
                <span>Star</span>
                <span className="bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-full text-xs">
                  {project.stars}
                </span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {project.branches.length}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Branches
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {project.collaborators.length}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Collaborators
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {project.issues.length}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Issues
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {project.milestones.length}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Milestones
              </div>
            </div>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-8 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <button className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-4 -mb-4">
              <Book className="h-4 w-4" />
              <span>Overview</span>
            </button>
            
            <button className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <GitBran className="h-4 w-4" />
              <span>Branches</span>
            </button>
            
            <button className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <Bug className="h-4 w-4" />
              <span>Issues</span>
              <span className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full text-xs">
                {project.issues.length}
              </span>
            </button>
            
            <button className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <Target className="h-4 w-4" />
              <span>Milestones</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* README */}
            {project.readme ? (
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                    {project.readme}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No README yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Add a README to help others understand your project
                </p>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all mx-auto">
                  <Plus className="h-4 w-4" />
                  <span>Add README</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Collaborators */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Collaborators ({project.collaborators.length + 1})
            </h3>
            <button className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Invite</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Owner */}
            <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              {project.author.avatar ? (
                <img
                  src={project.author.avatar}
                  alt={project.author.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {project.author.username[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium text-slate-900 dark:text-white">
                  {project.author.username}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Owner
                </div>
              </div>
            </div>

            {/* Collaborators */}
            {project.collaborators.map(collaborator => (
              <div key={collaborator.id} className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                {collaborator.avatar ? (
                  <img
                    src={collaborator.avatar}
                    alt={collaborator.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {collaborator.username[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {collaborator.username}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Collaborator
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Recent Activity
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <GitBranch className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-slate-900 dark:text-white">
                  <span className="font-medium">{project.author.username}</span> created the project
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-slate-900 dark:text-white">
                  Added {project.collaborators.length} collaborator{project.collaborators.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};