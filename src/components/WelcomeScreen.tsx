import { useState, FormEvent } from 'react';
import { useQuestStore } from '../store';
import { Trophy, Github, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export function WelcomeScreen() {
  const [tokenInput, setTokenInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useQuestStore((state) => state.login);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(tokenInput.trim());
    } catch (err) {
      setError('Invalid GitHub token. Please make sure it has "gist" permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-quest-bg flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-quest-card border border-quest-border rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-quest-border flex items-center justify-center border-2 border-quest-gold shadow-[0_0_30px_rgba(251,191,36,0.2)] mb-6">
            <Trophy className="text-quest-gold w-10 h-10" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-2">QuestLog</h1>
          <p className="text-quest-muted">Gamify your daily life. Level up your productivity.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-mono text-quest-muted mb-2">
              GitHub Personal Access Token
            </label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-quest-bg border border-quest-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-quest-gold transition-colors font-mono"
              required
            />
            <p className="text-xs text-quest-muted mt-2">
              Requires a token with the <strong className="text-white">gist</strong> scope to save your progress.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-quest-gold hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Github className="w-5 h-5" />
                Enter the Realm
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
