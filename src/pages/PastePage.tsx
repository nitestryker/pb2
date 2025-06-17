import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Star, 
  GitFork, 
  Copy, 
  Download, 
  Share2, 
  Calendar,
  User,
  Code,
  Edit,
  Heart,
  MessageSquare
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export const PastePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pastes } = useAppStore();
  
  const paste = pastes.find(p => p.id === id);

  if (!paste) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Paste not found
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            The paste you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([paste.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${paste.title}.${paste.language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('File downloaded!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: paste.title,
          text: `Check out this code snippet: ${paste.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {paste.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>by</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {paste.author.username}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(paste.createdAt), { addSuffix: true })}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Code className="h-4 w-4" />
                  <span className="capitalize">{paste.language}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                <Edit className="h-4 w-4" />
                <span>Fork</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <Eye className="h-4 w-4" />
              <span>{paste.views} views</span>
            </div>
            
            <button className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-yellow-500 transition-colors">
              <Star className="h-4 w-4" />
              <span>{paste.stars}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">
              <GitFork className="h-4 w-4" />
              <span>{paste.forks}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors">
              <Heart className="h-4 w-4" />
              <span>Like</span>
            </button>
          </div>

          {/* Tags */}
          {paste.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {paste.tags.map(tag => (
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

        {/* Code Block */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                {paste.language}
              </span>
            </div>
            
            <button
              onClick={handleCopy}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Copy code
            </button>
          </div>
          
          <div className="p-6 overflow-auto">
            <pre className="text-sm text-slate-800 dark:text-slate-200 font-mono leading-relaxed">
              <code>{paste.content}</code>
            </pre>
          </div>
        </div>

        {/* AI Summary (if available) */}
        {paste.aiSummary && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                AI Summary
              </h3>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                {Math.round(paste.aiSummary.confidence * 100)}% confident
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {paste.aiSummary.content}
            </p>
          </div>
        )}

        {/* Related Pastes */}
        {paste.relatedPastes && paste.relatedPastes.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Related Pastes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paste.relatedPastes.slice(0, 3).map(related => (
                <div
                  key={related.paste.id}
                  className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
                >
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                    {related.paste.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Related by {related.reason}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="capitalize">{related.paste.language}</span>
                    <span>{Math.round(related.relevanceScore * 100)}% match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};