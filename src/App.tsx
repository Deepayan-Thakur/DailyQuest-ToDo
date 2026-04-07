/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { Header } from './components/Header';
import { QuestList } from './components/QuestList';
import { RewardList } from './components/RewardList';
import { LevelUpModal } from './components/LevelUpModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StreakBoard } from './components/StreakBoard';
import { useQuestStore } from './store';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { token, login, isLoaded } = useQuestStore();

  // Attempt to auto-login if we have a token stored locally
  useEffect(() => {
    if (token && !isLoaded) {
      login(token).catch(() => {
        // If auto-login fails (e.g. token expired), the store will clear it
      });
    }
  }, [token, isLoaded, login]);

  if (!token) {
    return <WelcomeScreen />;
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-quest-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-quest-gold">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="font-serif text-xl animate-pulse">Loading your realm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-quest-bg text-quest-text font-sans">
      <Header />
      <LevelUpModal />
      <main className="max-w-4xl mx-auto p-4 py-8 space-y-8">
        <StreakBoard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <section>
            <QuestList />
          </section>
          <section>
            <RewardList />
          </section>
        </div>
      </main>
    </div>
  );
}
