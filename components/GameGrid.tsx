'use client';

import { GameCard } from './GameCard';
import { Card, GridSize, useGameStore } from '@/lib/store';

interface GameGridProps {
  cards: Card[];
  gridSize: GridSize;
  onCardClick: (cardId: string) => void;
  mismatchedCards?: string[];
}

export function GameGrid({
  cards,
  gridSize,
  onCardClick,
  mismatchedCards = [],
}: GameGridProps) {
  const { settings } = useGameStore();
  let columns: number;

  if (gridSize === 'custom' && settings.customWidth) {
    columns = settings.customWidth;
  } else {
    switch (gridSize) {
      case '4x4':
        columns = 4;
        break;
      case '6x6':
        columns = 6;
        break;
      case 'custom':
        columns = 4; // Default for custom
        break;
      default:
        columns = 4;
    }
  }

  const gapClass =
    columns <= 4
      ? 'gap-3 sm:gap-4'
      : columns <= 6
        ? 'gap-2 sm:gap-3'
        : 'gap-1 sm:gap-2';

  return (
    <div
      className={`grid ${gapClass} justify-center`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      role="grid"
      aria-label="Memory game grid"
    >
      {cards.map((card) => (
        <GameCard
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.id)}
          gridSize={gridSize}
          isMismatched={mismatchedCards.includes(card.id)}
        />
      ))}
    </div>
  );
}
