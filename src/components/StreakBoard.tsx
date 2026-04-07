import { useQuestStore } from '../store';
import { Flame } from 'lucide-react';
import { useMemo } from 'react';

export function StreakBoard() {
  const completedDates = useQuestStore((state) => state.stats.completedDates);

  const { days, currentStreak, maxStreak } = useMemo(() => {
    const today = new Date();
    const daysArray = [];
    
    let current = 0;
    let max = 0;
    let tempStreak = 0;
    
    // Generate last 119 days (17 weeks * 7 days) for mobile friendly grid
    for (let i = 118; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = completedDates[dateStr] || 0;
      
      daysArray.push({
        date: dateStr,
        count
      });
    }

    // Calculate streaks
    const sortedDates = Object.keys(completedDates).sort();
    let lastDate = null;

    for (const dateStr of sortedDates) {
      if (completedDates[dateStr] > 0) {
        if (!lastDate) {
          tempStreak = 1;
        } else {
          const d1 = new Date(lastDate);
          const d2 = new Date(dateStr);
          const diffTime = Math.abs(d2.getTime() - d1.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        }
        if (tempStreak > max) max = tempStreak;
        lastDate = dateStr;
      }
    }

    // Check current streak (must include today or yesterday)
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (completedDates[todayStr] > 0 || completedDates[yesterdayStr] > 0) {
      current = tempStreak;
    } else {
      current = 0;
    }

    return { days: daysArray, currentStreak: current, maxStreak: max };
  }, [completedDates]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-quest-card border border-quest-border';
    if (count === 1) return 'bg-green-900 border border-green-800';
    if (count === 2) return 'bg-green-700 border border-green-600';
    if (count === 3) return 'bg-green-500 border border-green-400';
    return 'bg-green-400 border border-green-300';
  };

  return (
    <div className="bg-quest-card border border-quest-border p-6 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold flex items-center gap-2">
          <Flame className="text-orange-500" />
          Quest Streak
        </h2>
        <div className="flex gap-4 text-sm font-mono">
          <div className="text-center">
            <div className="text-quest-muted">Current</div>
            <div className="font-bold text-orange-400">{currentStreak} days</div>
          </div>
          <div className="text-center">
            <div className="text-quest-muted">Max</div>
            <div className="font-bold text-quest-gold">{maxStreak} days</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5">
          {days.map((day, i) => (
            <div
              key={day.date}
              className={`w-3.5 h-3.5 rounded-sm ${getColor(day.count)}`}
              title={`${day.count} quests on ${day.date}`}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 text-xs font-mono text-quest-muted">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-quest-card border border-quest-border" />
          <div className="w-3 h-3 rounded-sm bg-green-900 border border-green-800" />
          <div className="w-3 h-3 rounded-sm bg-green-700 border border-green-600" />
          <div className="w-3 h-3 rounded-sm bg-green-500 border border-green-400" />
          <div className="w-3 h-3 rounded-sm bg-green-400 border border-green-300" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
