import { useState, FormEvent } from 'react';
import { useQuestStore } from '../store';
import { Gift, Plus, Trash2, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function RewardList() {
  const { rewards, stats, addReward, buyReward, deleteReward } = useQuestStore();
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState(50);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newCost <= 0) return;
    addReward(newTitle.trim(), newCost);
    setNewTitle('');
    setNewCost(50);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
          <Gift className="text-quest-muted" />
          Rewards
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
              <label className="block text-xs font-mono text-quest-muted mb-1 uppercase tracking-wider">Reward Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Watch an episode of..."
                className="w-full bg-quest-bg border border-quest-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-quest-gold transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-quest-muted mb-1 uppercase tracking-wider">Gold Cost</label>
              <input
                type="number"
                min="1"
                value={newCost}
                onChange={(e) => setNewCost(parseInt(e.target.value) || 0)}
                className="w-full bg-quest-bg border border-quest-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-quest-gold transition-colors"
              />
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
                Add Reward
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {rewards.length === 0 && !isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12 border border-dashed border-quest-border rounded-xl text-quest-muted"
            >
              <p className="font-serif text-lg mb-2">No rewards set</p>
              <p className="text-sm">What are you fighting for?</p>
            </motion.div>
          )}
          {rewards.map((reward) => {
            const canAfford = stats.gold >= reward.cost;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={reward.id}
                className={`group relative bg-quest-card border p-4 rounded-xl transition-all ${
                  canAfford ? 'border-quest-gold/30 hover:border-quest-gold' : 'border-quest-border opacity-75'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium pr-8">{reward.title}</h3>
                  <button
                    onClick={() => deleteReward(reward.id)}
                    className="absolute top-4 right-4 text-quest-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-quest-gold font-mono">
                    <Coins className="w-4 h-4" />
                    <span>{reward.cost}</span>
                  </div>
                  <button
                    onClick={() => buyReward(reward.id)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                      canAfford 
                        ? 'bg-quest-gold text-black hover:bg-yellow-400' 
                        : 'bg-quest-border text-quest-muted cursor-not-allowed'
                    }`}
                  >
                    Claim
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
