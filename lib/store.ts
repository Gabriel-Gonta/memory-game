import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { gameIcons } from './icons';

export type Theme = 'numbers' | 'icons';
export type IconTheme =
  | 'icons'
  | 'pokemon'
  | 'dogs'
  | 'movies'
  | 'flags'
  | 'fruits';
export type GridSize = '4x4' | '6x6' | 'custom';
export type GameState = 'idle' | 'playing' | 'finished';

export interface GameSettings {
  theme: Theme;
  iconTheme?: IconTheme; // Sub-theme for icons (icons, pokemon, dogs, movies)
  gridSize: GridSize;
  customWidth?: number; // For custom grid size
  customHeight?: number; // For custom grid size
  numberOfPlayers: number;
  playerNames: string[];
}

export interface Card {
  id: string;
  value: string | number;
  isFlipped: boolean;
  isMatched: boolean;
  // For dynamic themes (pokemon, dogs, movies, flags)
  image?: string;
  name?: string;
  // For emoji themes (fruits)
  emoji?: string;
  // For icon theme
  iconName?: string;
}

export interface ThemeItem {
  id: string | number;
  name?: string;
  image?: string;
  emoji?: string;
  iconName?: string;
}

export interface Player {
  id: number;
  name: string;
  score: number;
}

export interface GameStats {
  moves: number;
  time: number;
  startTime: number | null;
}

interface GameStore {
  settings: GameSettings;
  cards: Card[];
  players: Player[];
  currentPlayerIndex: number;
  gameState: GameState;
  stats: GameStats;
  flippedCards: string[];
  matchedPairs: number;
  isChecking: boolean;
  mismatchedCards: string[];

  setSettings: (settings: GameSettings) => void;
  initializeGame: (themeData?: ThemeItem[]) => void;
  flipCard: (cardId: string) => void;
  checkMatch: () => void;
  nextTurn: () => void;
  resetGame: () => void;
  startNewGame: () => void;
  updateTime: (time: number) => void;
}

const generateCards = (
  gridSize: GridSize,
  theme: Theme,
  iconTheme?: IconTheme,
  themeData?: ThemeItem[],
  customWidth?: number,
  customHeight?: number
): Card[] => {
  let size: number;
  if (gridSize === 'custom' && customWidth && customHeight) {
    size = customWidth * customHeight;
  } else {
    switch (gridSize) {
      case '4x4':
        size = 16;
        break;
      case '6x6':
        size = 36;
        break;
      case 'custom':
        // Custom defaults to 4x4 if not specified
        size = 16;
        break;
      default:
        size = 16;
    }
  }
  const pairs = size / 2;
  const cards: Card[] = [];

  if (theme === 'numbers') {
    const values: number[] = [];
    for (let i = 1; i <= pairs; i++) {
      values.push(i);
      values.push(i);
    }
    // Shuffle
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    cards.push(
      ...values.map((value, index) => ({
        id: `card-${index}`,
        value,
        isFlipped: false,
        isMatched: false,
      }))
    );
  } else if (theme === 'icons') {
    // Check iconTheme for dynamic themes
    console.log('🔍 Checking theme condition:', {
      iconTheme,
      themeDataLength: themeData?.length || 0,
      pairs,
      condition:
        iconTheme &&
        iconTheme !== 'icons' &&
        themeData &&
        themeData.length >= pairs,
    });
    if (
      iconTheme &&
      iconTheme !== 'icons' &&
      themeData &&
      themeData.length > 0
    ) {
      // Dynamic themes (pokemon, dogs, movies, flags, fruits)
      // Use available items, even if less than pairs (some movies might be filtered out)
      const availablePairs = Math.min(themeData.length, pairs);
      const selectedItems = themeData.slice(0, availablePairs);
      console.log(
        '🎬 Generating cards for theme:',
        iconTheme,
        'with',
        selectedItems.length,
        'items'
      );
      console.log('🎬 First item sample:', selectedItems[0]);

      const items: ThemeItem[] = [];
      selectedItems.forEach((item) => {
        items.push({ ...item });
        items.push({ ...item });
      });
      // Shuffle
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      const generatedCards = items.map((item, index) => ({
        id: `card-${index}`,
        value: item.id,
        image: item.image,
        name: item.name,
        emoji: item.emoji,
        isFlipped: false,
        isMatched: false,
      }));

      console.log('🎬 Generated cards sample:', generatedCards[0]);
      console.log('🎬 Card has image?', !!generatedCards[0]?.image);

      cards.push(...generatedCards);
    } else {
      // Default React icons from lucide-react
      const selectedIcons = gameIcons.slice(0, pairs);
      const iconPairs: string[] = [];
      selectedIcons.forEach((icon) => {
        iconPairs.push(icon.name);
        iconPairs.push(icon.name);
      });
      // Shuffle
      for (let i = iconPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [iconPairs[i], iconPairs[j]] = [iconPairs[j], iconPairs[i]];
      }
      cards.push(
        ...iconPairs.map((iconName, index) => ({
          id: `card-${index}`,
          value: iconName,
          iconName,
          isFlipped: false,
          isMatched: false,
        }))
      );
    }
  }

  return cards;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      settings: {
        theme: 'numbers',
        iconTheme: 'icons',
        gridSize: '4x4',
        numberOfPlayers: 1,
        playerNames: ['Player 1'],
      },
      cards: [],
      players: [],
      currentPlayerIndex: 0,
      gameState: 'idle',
      stats: {
        moves: 0,
        time: 0,
        startTime: null,
      },
      flippedCards: [],
      matchedPairs: 0,
      isChecking: false,
      mismatchedCards: [],

      setSettings: (settings) => {
        set({ settings });
      },

      initializeGame: (themeData?: ThemeItem[]) => {
        const { settings } = get();
        console.log(
          '🎮 initializeGame called with themeData:',
          themeData?.length || 0,
          'items'
        );
        console.log('🎮 Settings:', {
          theme: settings.theme,
          iconTheme: settings.iconTheme,
        });
        if (themeData && themeData.length > 0) {
          console.log('🎮 First theme item:', themeData[0]);
          console.log('🎮 Theme item has image?', !!themeData[0]?.image);
        }
        const cards = generateCards(
          settings.gridSize,
          settings.theme,
          settings.iconTheme,
          themeData,
          settings.customWidth,
          settings.customHeight
        );
        console.log('🎮 Generated', cards.length, 'cards');
        if (cards.length > 0) {
          console.log('🎮 First card:', cards[0]);
          console.log('🎮 First card has image?', !!cards[0]?.image);
          console.log('🎮 First card has iconName?', !!cards[0]?.iconName);
        }
        const players: Player[] = Array.from(
          { length: settings.numberOfPlayers },
          (_, i) => ({
            id: i + 1,
            name: settings.playerNames[i]?.trim() || `Player ${i + 1}`,
            score: 0,
          })
        );

        set({
          cards,
          players,
          currentPlayerIndex: 0,
          gameState: 'playing',
          stats: {
            moves: 0,
            time: 0,
            startTime: Date.now(),
          },
          flippedCards: [],
          matchedPairs: 0,
          isChecking: false,
          mismatchedCards: [],
        });
      },

      flipCard: (cardId: string) => {
        const { cards, flippedCards, gameState, isChecking } = get();

        if (gameState !== 'playing') return;
        if (isChecking) return;
        if (flippedCards.length >= 2) return;

        const card = cards.find((c) => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;

        const updatedCards = cards.map((c) =>
          c.id === cardId ? { ...c, isFlipped: true } : c
        );

        set({
          cards: updatedCards,
          flippedCards: [...flippedCards, cardId],
        });
      },

      checkMatch: () => {
        const {
          cards,
          flippedCards,
          players,
          currentPlayerIndex,
          matchedPairs,
        } = get();

        if (flippedCards.length !== 2) return;

        const [card1Id, card2Id] = flippedCards;
        const card1 = cards.find((c) => c.id === card1Id);
        const card2 = cards.find((c) => c.id === card2Id);

        if (!card1 || !card2) return;

        // Set checking state to prevent additional flips
        set({ isChecking: true });

        const isMatch = card1.value === card2.value;
        const totalPairs = cards.length / 2;
        const newMatchedPairs = isMatch ? matchedPairs + 1 : matchedPairs;

        if (isMatch) {
          // Match found - keep cards flipped and mark as matched
          const updatedCards = cards.map((c) => {
            if (c.id === card1Id || c.id === card2Id) {
              return {
                ...c,
                isMatched: true,
                isFlipped: true,
              };
            }
            return c;
          });

          const updatedPlayers = players.map((p, idx) => {
            if (idx === currentPlayerIndex) {
              return { ...p, score: p.score + 1 };
            }
            return p;
          });

          const gameFinished = newMatchedPairs === totalPairs;

          set({
            cards: updatedCards,
            flippedCards: [],
            players: updatedPlayers,
            matchedPairs: newMatchedPairs,
            stats: {
              ...get().stats,
              moves: get().stats.moves + 1,
            },
            gameState: gameFinished ? 'finished' : 'playing',
            isChecking: false,
          });

          if (gameFinished) {
            return;
          }
          // If match found, player stays on same turn (no need to switch)
        } else {
          // No match - show red shake animation, then flip back after delay
          set({ mismatchedCards: [card1Id, card2Id] });

          setTimeout(() => {
            const currentState = get();
            const currentCards = currentState.cards;
            const currentPlayers = currentState.players;
            const currentPlayerIndex = currentState.currentPlayerIndex;

            // Ensure all unmatched cards are flipped back
            const updatedCards = currentCards.map((c) => {
              if (c.id === card1Id || c.id === card2Id) {
                return { ...c, isFlipped: false };
              }
              // Also ensure any other flipped but unmatched cards are flipped back
              if (c.isFlipped && !c.isMatched) {
                return { ...c, isFlipped: false };
              }
              return c;
            });

            const updatedStats = {
              ...currentState.stats,
              moves: currentState.stats.moves + 1,
            };

            if (currentPlayers.length > 1) {
              // Switch turn in multiplayer
              const nextIndex =
                (currentPlayerIndex + 1) % currentPlayers.length;
              set({
                cards: updatedCards,
                flippedCards: [],
                mismatchedCards: [], // Reset mismatched cards for next player
                currentPlayerIndex: nextIndex,
                stats: updatedStats,
                isChecking: false,
              });
            } else {
              // Solo mode - just reset flipped cards
              set({
                cards: updatedCards,
                flippedCards: [],
                mismatchedCards: [],
                stats: updatedStats,
                isChecking: false,
              });
            }
          }, 1000);
        }
      },

      nextTurn: () => {
        const { players, currentPlayerIndex, cards } = get();
        if (players.length > 1) {
          const nextIndex = (currentPlayerIndex + 1) % players.length;
          // Ensure all unmatched cards are flipped back when switching turns
          const updatedCards = cards.map((c) =>
            c.isMatched ? c : { ...c, isFlipped: false }
          );
          set({
            currentPlayerIndex: nextIndex,
            flippedCards: [],
            mismatchedCards: [], // Reset mismatched cards
            cards: updatedCards, // Ensure all cards are face down except matched ones
          });
        }
      },

      resetGame: () => {
        get().initializeGame();
      },

      startNewGame: () => {
        set({
          gameState: 'idle',
          cards: [],
          players: [],
          flippedCards: [],
          matchedPairs: 0,
          isChecking: false,
          mismatchedCards: [],
        });
      },

      updateTime: (time: number) => {
        set({
          stats: {
            ...get().stats,
            time,
            // Ensure startTime is set if game is playing
            startTime:
              get().stats.startTime ||
              (get().gameState === 'playing' ? Date.now() : null),
          },
        });
      },
    }),
    {
      name: 'memory-game-storage',
      partialize: (state) => ({
        settings: state.settings,
        cards: state.cards.map((card) => ({
          ...card,
          // Keep card state but reset flipped for better UX on reload
          isFlipped: false,
        })),
        players: state.players,
        currentPlayerIndex: state.currentPlayerIndex,
        gameState: state.gameState, // Preserve game state (playing, finished, idle)
        stats: {
          ...state.stats,
          // Preserve time and moves
          // startTime will be recalculated on restore
        },
        matchedPairs: state.matchedPairs,
        // isChecking and flippedCards are not persisted (reset on page load)
      }),
    }
  )
);
