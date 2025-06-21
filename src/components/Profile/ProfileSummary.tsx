import React from 'react';
import { ProfileSummary as ProfileSummaryType } from '../../types';

interface Props {
  summary: ProfileSummaryType | null;
}

export const ProfileSummary: React.FC<Props> = ({ summary }) => {
  if (!summary) return null;
  return (
    <div className="profile-summary-card bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">📊 Profile Summary</h3>
      <p className="text-slate-700 dark:text-slate-300"><strong>Account Status:</strong> {summary.accountStatus}</p>
      <p className="text-slate-700 dark:text-slate-300"><strong>Join Date:</strong> {new Date(summary.joinDate).toLocaleDateString()}</p>
      <p className="text-slate-700 dark:text-slate-300"><strong>Activity:</strong> {summary.activity}</p>
      <p className="text-slate-700 dark:text-slate-300"><strong>Total Engagement:</strong> {summary.totalEngagement} interactions</p>
      <p className="text-slate-700 dark:text-slate-300"><strong>Average Views:</strong> {summary.averageViews} per paste</p>
      <p className="text-slate-700 dark:text-slate-300"><strong>Social Reach:</strong> {summary.followers} followers</p>
    </div>
  );
};
