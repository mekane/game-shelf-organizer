import { Game } from '@lib/boardgame.api.client';

export const debounce = (func, delay: number) => {
  let timeoutId: number;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const byName = (g1: Game, g2: Game) => {
  return g1.name.localeCompare(g2.name);
};
