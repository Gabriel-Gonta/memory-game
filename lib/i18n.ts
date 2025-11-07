import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    game: 'Jeu',
    results: 'Résultats',
    top10: 'Top 10',

    // Home page
    selectTheme: 'Sélectionner le thème',
    numbers: 'Nombres',
    icons: 'Icônes',
    numberOfPlayers: 'Nombre de joueurs',
    gridSize: 'Taille de la grille',
    custom: 'Personnalisé',
    startGame: 'Démarrer le jeu',
    gameMode: 'Mode de jeu',
    localMode: 'Local',
    onlineMode: 'En ligne',
    createRoom: 'Créer une salle',
    joinRoom: 'Rejoindre une salle',
    roomCode: 'Code de la salle',
    enterRoomCode: 'Entrez le code de la salle',
    waitingPlayers: 'En attente de joueurs...',
    copyCode: 'Copier le code',
    codeCopied: 'Code copié !',

    // Game page
    restart: 'Redémarrer',
    newGame: 'Nouvelle partie',
    quit: 'Quitter',
    time: 'Temps',
    moves: 'Coups',
    currentTurn: 'TOUR ACTUEL',

    // Results page
    youDidIt: 'Vous avez réussi !',
    gameOver: 'Partie terminée !',
    winner: 'Vainqueur',
    timeElapsed: 'Temps écoulé',
    movesTaken: 'Coups effectués',
    finalScores: 'Scores finaux',
    pairs: 'Paires',
    playAgain: 'Rejouer',
    returnToMenu: 'Revenir au menu',
    viewTop10: 'Voir le tableau des scores',
    newRecord: 'Nouveau record !',
    newRecordMessage: 'est maintenant #1 !',
    newRecordMessageYou: 'Vous êtes maintenant #1 !',
    congratulations: 'Félicitations pour ce score exceptionnel !',

    // Top 10 page
    top10Scores: 'Top 10 des scores',
    totalGames: 'Total des parties',
    averageScore: 'Score moyen',
    avgPairs: 'Moy. Paires',
    totalPlayers: 'Total joueurs',
    avgTime: 'Moy. Temps',
    avgMoves: 'Moy. Coups',
    bestTime: 'Meilleur temps',
    bestMoves: 'Meilleur coups',
    pair: 'Paire',
    move: 'coup',
    noScoresYet: 'Aucun score pour le moment. Soyez le premier à jouer !',

    // Player names
    player: 'Joueur',
    playerName: 'Nom du joueur',
    enterPlayerName: 'Entrez le nom du joueur',

    // Icon themes
    chooseCategory: 'Choisir une catégorie',
    pokemon: 'Pokémon',
    dogs: 'Chiens',
    movies: 'Films',
    flags: 'Drapeaux',
    fruits: 'Fruits',
    loading: 'Chargement...',
  },
  en: {
    // Navigation
    home: 'Home',
    game: 'Game',
    results: 'Results',
    top10: 'Top 10',

    // Home page
    selectTheme: 'Select Theme',
    numbers: 'Numbers',
    icons: 'Icons',
    numberOfPlayers: 'Number of Players',
    gridSize: 'Grid Size',
    custom: 'Custom',
    startGame: 'Start Game',
    gameMode: 'Game Mode',
    localMode: 'Local',
    onlineMode: 'Online',
    createRoom: 'Create Room',
    joinRoom: 'Join Room',
    roomCode: 'Room Code',
    enterRoomCode: 'Enter room code',
    waitingPlayers: 'Waiting for players...',
    copyCode: 'Copy Code',
    codeCopied: 'Code copied!',

    // Game page
    restart: 'Restart',
    newGame: 'New Game',
    quit: 'Quit',
    time: 'Time',
    moves: 'Moves',
    currentTurn: 'CURRENT TURN',

    // Results page
    youDidIt: 'You did it!',
    gameOver: 'Game Over!',
    winner: 'Winner',
    timeElapsed: 'Time Elapsed',
    movesTaken: 'Moves Taken',
    finalScores: 'Final Scores',
    pairs: 'Pairs',
    playAgain: 'Play Again',
    returnToMenu: 'Return to Menu',
    viewTop10: 'View Top 10',
    newRecord: 'New Record!',
    newRecordMessage: 'is now #1!',
    newRecordMessageYou: 'You are now #1!',
    congratulations: 'Congratulations on this exceptional score!',

    // Top 10 page
    top10Scores: 'Top 10 Scores',
    totalGames: 'Total Games',
    averageScore: 'Average Score',
    avgPairs: 'Avg Pairs',
    totalPlayers: 'Total Players',
    avgTime: 'Avg Time',
    avgMoves: 'Avg Moves',
    bestTime: 'Best Time',
    bestMoves: 'Best Moves',
    pair: 'Pair',
    move: 'move',
    noScoresYet: 'No scores yet. Be the first to play!',

    // Player names
    player: 'Player',
    playerName: 'Player Name',
    enterPlayerName: 'Enter player name',

    // Icon themes
    chooseCategory: 'Choose a category',
    pokemon: 'Pokémon',
    dogs: 'Dogs',
    movies: 'Movies',
    flags: 'Flags',
    fruits: 'Fruits',
    loading: 'Loading...',
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;

interface I18nStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Helper function to get translation - must be called from within a component that subscribes to language
export function useTranslation() {
  const language = useI18nStore((state) => state.language);
  return (key: TranslationKey) => translations[language][key] || key;
}

export const useI18nStore = create<I18nStore>()(
  persist(
    (set) => ({
      language: 'fr',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'i18n-storage',
      skipHydration: true, // Skip hydration to avoid mismatch
    }
  )
);
