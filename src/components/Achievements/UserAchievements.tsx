import React from 'react';

export interface Achievement {
  id: number;
  code: string;
  name: string;
  description?: string;
  category?: string;
  points: number;
  icon?: string;
  unlocked?: boolean;
}

interface Props {
  achievements: Achievement[];
}

export const UserAchievements: React.FC<Props> = ({ achievements }) => {
  const unlocked = achievements.filter((a) => a.unlocked);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Achievements</div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {unlocked.length} / {achievements.length} unlocked
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`border rounded-lg p-3 text-center ${ach.unlocked ? '' : 'opacity-50'}`}
          >
            <div className="text-2xl mb-2">{ach.icon || '🏆'}</div>
            <div className="font-medium">{ach.name}</div>
            <div className="text-xs text-slate-500">{ach.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
};
