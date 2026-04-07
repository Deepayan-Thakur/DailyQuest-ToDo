# ⚔️ QuestLog

**Level up your life.** QuestLog is a gamified task management application that turns your daily chores and to-dos into epic quests. Earn Experience Points (XP) to level up, collect Gold to spend on custom rewards, and track your consistency with a GitHub-style contribution graph.

All your progress is securely synced to your own private GitHub Gist, ensuring you never lose your hard-earned loot!

## ✨ Features

* **🎮 RPG Mechanics:** Assign difficulties (Easy, Medium, Hard, Epic) to your tasks. Harder quests yield greater XP and Gold rewards.
* **📈 Leveling System:** Accumulate XP to level up your character. Enjoy a satisfying animated celebration every time you reach a new level.
* **💰 Custom Rewards:** Create your own real-life rewards (e.g., "Watch an episode of anime", "Buy a coffee") and purchase them using the Gold you earn from completing quests.
* **🔥 Streak Board:** Track your daily consistency with a GitHub-style green contribution graph. See your current and maximum streaks at a glance.
* **☁️ GitHub Gist Sync:** 100% serverless cloud saves. Your data is stored securely in a private GitHub Gist using your Personal Access Token (PAT).
* **🎉 Satisfying Interactions:** Fluid animations powered by Motion and celebratory confetti pops whenever you conquer a quest.
* **📱 Fully Responsive:** Beautiful dark-fantasy UI that works flawlessly on desktop, tablet, and mobile devices.

## 🚀 Getting Started

To use QuestLog, you only need one thing: a **GitHub Personal Access Token (PAT)**.

### 1. Generate a GitHub Token
1. Go to your GitHub Settings -> Developer settings -> Personal access tokens -> Tokens (classic).
2. Click **Generate new token (classic)**.
3. Give it a note (e.g., "QuestLog App").
4. Under **Select scopes**, check **ONLY** the `gist` scope (Create gists).
5. Generate the token and copy it. *(Keep this safe!)*

### 2. Enter the Realm
1. Open the QuestLog app.
2. Paste your GitHub token into the Welcome Screen.
3. The app will automatically create a private gist named `questlog-save.json` on your account and sync your progress across devices.

## 🛠️ Tech Stack

* **Frontend Framework:** React 19 + TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS v4
* **State Management:** Zustand (with persist middleware for local caching)
* **Animations:** Motion (`motion/react`) & Canvas Confetti
* **Icons:** Lucide React
* **Backend/Storage:** GitHub Gists API (Serverless)

## 💻 Local Development

If you want to run QuestLog locally or contribute:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd questlog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

* `/src/components/` - React components (Header, QuestList, RewardList, StreakBoard, etc.)
* `/src/services/` - API integrations (`gistService.ts` for GitHub Gist syncing)
* `/src/store.ts` - Zustand store definition, leveling logic, and reward multipliers.
* `/src/index.css` - Global styles, custom scrollbars, and Tailwind theme configuration.

## 📜 License

MIT License - feel free to use, modify, and distribute as you see fit. Happy questing!
