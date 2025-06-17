import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, User, Tag, FileText, ArrowRight } from 'lucide-react';
import { RelatedPaste } from '../../types';

interface RelatedPastesProps {
  relatedPastes: RelatedPaste[];
  title?: string;
}

export const RelatedPastes: React.FC<RelatedPastesProps> = ({ 
  relatedPastes, 
  title = "Related Pastes" 
}) => {
  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'language':
        return Code;
      case 'user':
        return User;
      case 'tags':
        return Tag;
      case 'content':
        return FileText;
      default:
        return Code;
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'language':
        return 'Same language';
      case 'user':
        return 'Same author';
      case 'tags':
        return 'Similar tags';
      case 'content':
        return 'Similar content';
      default:
        return 'Related';
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'language':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'user':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'tags':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'content':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700';
    }
  };

  if (!relatedPastes || relatedPastes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {relatedPastes.length} related
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPastes.map((related, index) => {
          const ReasonIcon = getReasonIcon(related.reason);
          const reasonLabel = getReasonLabel(related.reason);
          const reasonColor = getReasonColor(related.reason);

          return (
            <motion.div
              key={related.paste.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/paste/${related.paste.id}`}
                className="block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {related.paste.title}
                  </h4>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors ml-2 flex-shrink-0" />
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${reasonColor}`}>
                    <ReasonIcon className="h-3 w-3" />
                    <span>{reasonLabel}</span>
                  </span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded capitalize">
                    {related.paste.language}
                  </span>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  by {related.paste.author.username}
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded p-3 mb-3">
                  <pre className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 overflow-hidden">
                    <code>{related.paste.content}</code>
                  </pre>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-3">
                    <span>{related.paste.views} views</span>
                    <span>{related.paste.stars} stars</span>
                  </div>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    {Math.round(related.relevanceScore * 100)}% match
                  </span>
                </div>

                {related.paste.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {related.paste.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {related.paste.tags.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded">
                        +{related.paste.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};