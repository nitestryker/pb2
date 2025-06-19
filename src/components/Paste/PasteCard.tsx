import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Star, GitFork, Code, Lock } from 'lucide-react';
import { Paste } from '../../types';

interface PasteCardProps {
  paste: Paste;
}

export const PasteCard: React.FC<PasteCardProps> = ({ paste }) => {
  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      javascript: 'bg-yellow-500',
      typescript: 'bg-blue-500',
      python: 'bg-green-500',
      java: 'bg-orange-500',
      cpp: 'bg-blue-600',
      csharp: 'bg-purple-500',
      php: 'bg-indigo-500',
      ruby: 'bg-red-500',
      go: 'bg-cyan-500',
      rust: 'bg-orange-600',
    };
    return colors[language.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-lg group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link 
              to={`/paste/${paste.id}`}
              className="text-lg font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2"
            >
              {paste.title}
            </Link>
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center space-x-1">
                <div className={`w-3 h-3 rounded-full ${getLanguageColor(paste.language)}`}></div>
                <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                  {paste.language}
                </span>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {formatDistanceToNow(new Date(paste.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4 relative overflow-hidden">
          {paste.content === null ? (
            <div className="flex items-center text-slate-500 dark:text-slate-400 space-x-2">
              <Lock className="h-4 w-4" />
              <span>🔒 This paste is password protected.</span>
            </div>
          ) : (
            <pre className="text-sm text-slate-700 dark:text-slate-300 line-clamp-4 overflow-hidden">
              <code>{paste.content}</code>
            </pre>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900 pointer-events-none"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link
              to={`/profile/${paste.author.username}`}
              className="flex items-center space-x-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {paste.author.avatar ? (
                <img 
                  src={paste.author.avatar} 
                  alt={paste.author.username}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {paste.author.username[0].toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {paste.author.username}
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{paste.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>{paste.stars}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitFork className="h-4 w-4" />
              <span>{paste.forks}</span>
            </div>
          </div>
        </div>

        {paste.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {paste.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-md"
              >
                {tag}
              </span>
            ))}
            {paste.tags.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-md">
                +{paste.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};