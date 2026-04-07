import { Trophy, Coins, LogOut } from 'lucide-react';
import { useQuestStore, getXpForNextLevel } from '../store';
import { motion } from 'motion/react';
import { useState } from 'react';

export function Header() {
  const { stats, githubUser, logout } = useQuestStore();
  const [showProfile, setShowProfile] = useState(false);
  
  const xpForNextLevel = getXpForNextLevel(stats.level);
  const progress = (stats.xp / xpForNextLevel) * 100;

  return (
    <header className="bg-quest-card border-b border-quest-border p-4 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-quest-border flex items-center justify-center border-2 border-quest-gold shadow-[0_0_15px_rgba(251,191,36,0.2)]">
              <Trophy className="text-quest-gold w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-wider text-white">
                QuestLog
              </h1>
              <p className="text-quest-muted text-sm font-mono">
                Level {stats.level} Adventurer
              </p>
            </div>
          </div>
          
          {/* Mobile Profile Toggle */}
          <div className="md:hidden relative">
            <button onClick={() => setShowProfile(!showProfile)}>
              <img 
                src={githubUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${githubUser?.login || 'guest'}`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-quest-border"
              />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 w-full md:w-auto">
          <div className="flex-1 min-w-[200px] max-w-[300px]">
            <div className="flex justify-between text-xs font-mono text-quest-muted mb-1">
              <span>XP</span>
              <span>{Math.floor(stats.xp)} / {xpForNextLevel}</span>
            </div>
            <div className="h-2 bg-quest-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-quest-xp"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-quest-bg px-3 py-1.5 rounded-lg border border-quest-border">
            <Trophy className="w-4 h-4 text-quest-muted" />
            <span className="font-mono text-sm text-quest-muted">
              {stats.questsCompleted}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-quest-bg px-3 py-1.5 rounded-lg border border-quest-border">
            <Coins className="w-5 h-5 text-quest-gold" />
            <span className="font-mono font-bold text-quest-gold">
              {stats.gold}
            </span>
          </div>

          {/* Desktop Profile */}
          <div className="hidden md:block relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img 
                src={githubUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${githubUser?.login || 'guest'}`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-quest-border"
              />
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-quest-bg border border-quest-border rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-quest-border mb-2">
                  <p className="text-sm font-bold text-white truncate">{githubUser?.login}</p>
                  <p className="text-xs text-quest-muted truncate">GitHub Adventurer</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-quest-card flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Profile Menu */}
        {showProfile && (
          <div className="md:hidden w-full bg-quest-bg border border-quest-border rounded-xl p-4 mt-2 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">{githubUser?.login}</p>
              <p className="text-xs text-quest-muted">GitHub Adventurer</p>
            </div>
            <button
              onClick={logout}
              className="text-sm text-red-400 hover:bg-quest-card px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
