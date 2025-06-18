import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Eye, Settings, Upload, Wand2, Info } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const languages = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby', 
  'go', 'rust', 'html', 'css', 'scss', 'sql', 'bash', 'powershell', 'json', 
  'yaml', 'xml', 'markdown', 'dockerfile', 'nginx', 'apache'
];

const expirationOptions = [
  { label: 'Never', value: '' },
  { label: '10 minutes', value: '10m' },
  { label: '1 hour', value: '1h' },
  { label: '1 day', value: '1d' },
  { label: '1 week', value: '1w' },
  { label: '1 month', value: '1M' }
];

export const CreatePastePage: React.FC = () => {
  const navigate = useNavigate();
  const { addPaste } = useAppStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [expiration, setExpiration] = useState('');
  const [tags, setTags] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }

    // For anonymous users, prevent private pastes
    if (!isAuthenticated && visibility === 'private') {
      toast.error('Anonymous users cannot create private pastes');
      return;
    }

    const pasteData = {
      title: title.trim() || 'Untitled',
      content: content.trim(),
      language,
      author: isAuthenticated && user ? user : {
        id: 'anonymous',
        username: 'Anonymous',
        email: '',
        avatar: undefined,
        bio: undefined,
        website: undefined,
        location: undefined,
        joinDate: new Date().toISOString(),
        isAdmin: false,
        followers: 0,
        following: 0,
        pasteCount: 0,
        projectCount: 0
      },
      isPublic: visibility === 'public',
      isUnlisted: visibility === 'unlisted',
      expiresAt: expiration ? calculateExpirationDate(expiration) : undefined,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    addPaste(pasteData);
    toast.success('Paste created successfully!');
    navigate('/');
  };

  const calculateExpirationDate = (expiration: string): string => {
    const now = new Date();
    const unit = expiration.slice(-1);
    const value = parseInt(expiration.slice(0, -1));
    
    switch (unit) {
      case 'm':
        now.setMinutes(now.getMinutes() + value);
        break;
      case 'h':
        now.setHours(now.getHours() + value);
        break;
      case 'd':
        now.setDate(now.getDate() + value);
        break;
      case 'w':
        now.setDate(now.getDate() + (value * 7));
        break;
      case 'M':
        now.setMonth(now.getMonth() + value);
        break;
    }
    
    return now.toISOString();
  };

  const generateSmartTitle = async () => {
    if (!content.trim()) {
      toast.error('Add some code first to generate a title');
      return;
    }

    setIsGeneratingTitle(true);
    
    // Simulate AI title generation
    setTimeout(() => {
      const suggestions = [
        'React Custom Hook Implementation',
        'Python Data Processing Script',
        'TypeScript Interface Definitions',
        'Node.js API Endpoint',
        'CSS Grid Layout Helper',
        'Database Query Optimization',
        'Authentication Middleware',
        'Utility Functions Collection'
      ];
      
      const randomTitle = suggestions[Math.floor(Math.random() * suggestions.length)];
      setTitle(randomTitle);
      setIsGeneratingTitle(false);
      toast.success('Title generated!');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create New Paste
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {isAuthenticated 
              ? 'Share your code with the world or keep it private for your projects'
              : 'Share your code with the world - no account required!'
            }
          </p>
        </div>

        {/* Anonymous User Info */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                  Creating as Anonymous User
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Your paste will be attributed to "Anonymous". You can make it public (visible in archive) or unlisted (only accessible via link). 
                  <span className="font-medium"> Private pastes require an account.</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and AI Generation */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Title
              </label>
              <button
                type="button"
                onClick={generateSmartTitle}
                disabled={isGeneratingTitle}
                className="flex items-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-50 transition-colors"
              >
                <Wand2 className={`h-4 w-4 ${isGeneratingTitle ? 'animate-spin' : ''}`} />
                <span>{isGeneratingTitle ? 'Generating...' : 'AI Generate'}</span>
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title for your paste"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
            />
          </div>

          {/* Settings Row */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-slate-100"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Expiration
                </label>
                <select
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-slate-100"
                >
                  {expirationOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Visibility
                </label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={visibility === 'public'}
                      onChange={() => setVisibility('public')}
                      className="mr-2 text-indigo-600 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Public</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Visible in archive</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={visibility === 'unlisted'}
                      onChange={() => setVisibility('unlisted')}
                      className="mr-2 text-indigo-600 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Unlisted</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Only accessible via link</p>
                    </div>
                  </label>
                  
                  {isAuthenticated && (
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={visibility === 'private'}
                        onChange={() => setVisibility('private')}
                        className="mr-2 text-indigo-600 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Private</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Only you can see</p>
                      </div>
                    </label>
                  )}
                  
                  {!isAuthenticated && (
                    <div className="flex items-center opacity-50">
                      <input
                        type="radio"
                        disabled
                        className="mr-2 text-indigo-600 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Private</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Requires account</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, hooks, javascript, utility"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
            />
          </div>

          {/* Code Editor */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Code Editor
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsPreview(false)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      !isPreview 
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreview(true)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      isPreview 
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>
              
              <button
                type="button"
                className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Upload File</span>
              </button>
            </div>

            <div className="p-6">
              {!isPreview ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your code here..."
                  className="w-full h-96 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                  required
                />
              ) : (
                <div className="h-96 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-4 overflow-auto">
                  <pre className="text-sm text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap">
                    <code>{content || 'No content to preview'}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Save className="h-5 w-5" />
              <span>Create Paste</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};