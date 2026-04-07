import { useState, FormEvent } from 'react';
import { useQuestStore, Difficulty, DIFFICULTY_MULTIPLIER } from '../store';
import { Circle, Trash2, Plus, Swords, Coins, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

const difficultyColors: Record<Difficulty, string> = {
  Easy: 'text-green-400 border-green-400/20 bg-green-400/10',
  Medium: 'text-blue-400 border-blue-400/20 bg-blue-400/10',
  Hard: 'text-orange-400 border-orange-400/20 bg-orange-400/10',
  Epic: 'text-purple-400 border-purple-400/20 bg-purple-400/10',
};

export function QuestList() {
  const { quests, addQuest, completeQuest, deleteQuest } = useQuestStore();
  const [newTitle, setNewTitle] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('Easy');
  const [isAdding, setIsAdding] = useState(false);

  const activeQuests = quests.filter((q) => !q.completed).sort((a, b) => b.createdAt - a.createdAt);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addQuest(newTitle.trim(), newDifficulty);
    setNewTitle('');
    setIsAdding(false);
  };

  const handleComplete = (id: string) => {
    completeQuest(id);
    
    // Trigger confetti from left and right
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 100
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }

    fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0 } });
    fire(0.2, { spread: 60, origin: { x: 0 } });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, origin: { x: 0 } });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, origin: { x: 0 } });
    fire(0.1, { spread: 120, startVelocity: 45, origin: { x: 0 } });
    
    fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 1 } });
    fire(0.2, { spread: 60, origin: { x: 1 } });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, origin: { x: 1 } });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, origin: { x: 1 } });
    fire(0.1, { spread: 120, startVelocity: 45, origin: { x: 1 } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
          <Swords className="text-quest-muted" />
          Active Quests
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-quest-card hover:bg-quest-card-hover border border-quest-border p-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="bg-quest-card border border-quest-border p-4 rounded-xl space-y-4 overflow-hidden"
          >
            <div>
              <label className="block text-xs font-mono text-quest-muted mb-1 uppercase tracking-wider">Quest Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Defeat the laundry monster..."
                className="w-full bg-quest-bg border border-quest-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-quest-gold transition-colors"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              {(['Easy', 'Medium', 'Hard', 'Epic'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setNewDifficulty(diff)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-xs font-mono border transition-colors",
                    newDifficulty === diff ? difficultyColors[diff] : "border-quest-border text-quest-muted hover:bg-quest-border/50"
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm text-quest-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-quest-gold text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Accept Quest
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {activeQuests.length === 0 && !isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 border border-dashed border-quest-border rounded-xl text-quest-muted"
            >
              <p className="font-serif text-lg mb-2">No active quests</p>
              <p className="text-sm">The realm is peaceful. Perhaps too peaceful...</p>
            </motion.div>
          )}
          {activeQuests.map((quest) => {
            const rewards = DIFFICULTY_MULTIPLIER[quest.difficulty];
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                key={quest.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-quest-card border border-quest-border p-4 rounded-xl hover:border-quest-gold/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleComplete(quest.id)}
                    className="text-quest-muted hover:text-green-400 transition-colors shrink-0"
                  >
                    <Circle className="w-6 h-6" />
                  </button>
                  <div>
                    <h3 className="font-medium text-lg">{quest.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("text-xs font-mono px-2 py-0.5 rounded-full border", difficultyColors[quest.difficulty])}>
                        {quest.difficulty}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-mono text-quest-muted">
                        <span className="flex items-center gap-1 text-quest-xp">
                          <Star className="w-3 h-3" /> +{rewards.xp} XP
                        </span>
                        <span className="flex items-center gap-1 text-quest-gold">
                          <Coins className="w-3 h-3" /> +{rewards.gold} Gold
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteQuest(quest.id)}
                  className="text-quest-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all self-end sm:self-auto shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
