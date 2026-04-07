import { useEffect, useState } from 'react';
import { useQuestStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';

export function LevelUpModal() {
  const level = useQuestStore((state) => state.stats.level);
  const [prevLevel, setPrevLevel] = useState(level);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (level > prevLevel) {
      setShow(true);
      setPrevLevel(level);
      
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [level, prevLevel]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-quest-card border-2 border-quest-gold p-8 rounded-2xl flex flex-col items-center shadow-[0_0_50px_rgba(251,191,36,0.3)]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="mb-4"
            >
              <Star className="w-16 h-16 text-quest-gold fill-quest-gold" />
            </motion.div>
            <h2 className="font-serif text-4xl font-bold text-white mb-2">Level Up!</h2>
            <p className="text-quest-muted font-mono text-lg">You are now Level {level}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
