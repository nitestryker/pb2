import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Users, 
  Code, 
  Folder,
  Star,
  GitFork,
  Settings,
  UserPlus
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { mockUsers } from '../data/mockData';
import { PasteCard } from '../components/Paste/PasteCard';
import { formatDistanceToNow } from 'date-fns';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { pastes, projects } = useAppStore();
  const { user: currentUser } = useAuthStore();
  
  const user = mockUsers.find(u => u.username === username);
  const userPastes = pastes.filter(p => p.author.username === username && p.isPublic);
  const userProjects = projects.filter(p => p.author.username === username && p.isPublic);
  
  const isOwnProfile = currentUser?.username === username;

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            User not found
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            The user you're looking for doesn't exist.
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
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                    <User className="h-16 w-16 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {user.username}
                    </h1>
                    {user.bio && (
                      <p className="text-slate-600 dark:text-slate-300 mt-1">
                        {user.bio}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    {isOwnProfile ? (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        <Settings className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                        <UserPlus className="h-4 w-4" />
                        <span>Follow</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  {user.website && (
                    <div className="flex items-center space-x-1">
                      <LinkIcon className="h-4 w-4" />
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {user.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDistanceToNow(new Date(user.joinDate), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {user.followers}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              Followers
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {user.following}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              Following
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {user.pasteCount}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              Pastes
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {user.projectCount}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              Projects
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-8 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <button className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-4 -mb-4">
              <Code className="h-4 w-4" />
              <span>Pastes</span>
              <span className="bg-indigo-100 dark:bg-indigo-900/30 px-2 py-1 rounded-full text-xs">
                {userPastes.length}
              </span>
            </button>
            
            <button className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <Folder className="h-4 w-4" />
              <span>Projects</span>
              <span className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full text-xs">
                {userProjects.length}
              </span>
            </button>
          </div>

          <div className="p-6">
            {userPastes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPastes.slice(0, 6).map((paste, index) => (
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
                <Code className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No public pastes yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {isOwnProfile 
                    ? "Create your first paste to get started" 
                    : `${user.username} hasn't shared any public pastes yet`
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Graph Placeholder */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Contribution Activity
          </h3>
          
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 365 }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${
                  Math.random() > 0.7 
                    ? 'bg-green-500' 
                    : Math.random() > 0.5 
                    ? 'bg-green-300' 
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
                title={`Activity on day ${i + 1}`}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm text-slate-600 dark:text-slate-400">
            <span>Less</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-300 dark:bg-green-600 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 dark:bg-green-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};