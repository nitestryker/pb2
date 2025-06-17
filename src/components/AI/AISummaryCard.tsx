import React from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, Clock, Zap } from 'lucide-react';
import { AISummary } from '../../types';

interface AISummaryCardProps {
  summary: AISummary;
  onApprove?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({
  summary,
  onApprove,
  onReject,
  showActions = false
}) => {
  const confidenceColor = summary.confidence >= 0.8 
    ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
    : summary.confidence >= 0.6
    ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
    : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              AI Summary
            </h3>
            <div className="flex items-center space-x-3 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${confidenceColor}`}>
                {Math.round(summary.confidence * 100)}% confident
              </span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
                {summary.model}
              </span>
              {!summary.approved && (
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Pending Review</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        {showActions && !summary.approved && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onApprove}
              className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              title="Approve summary"
            >
              <CheckCircle className="h-5 w-5" />
            </button>
            <button
              onClick={onReject}
              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Reject summary"
            >
              <Zap className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
        {summary.content}
      </p>

      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-4">
          <span>Tokens: {summary.tokens}</span>
          <span>
            Generated {new Date(summary.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        {summary.approved && (
          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span>Approved</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};