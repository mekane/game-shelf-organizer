import { Collection } from '../../entities';
import { Game } from '../../entities/';
import { BggGameData } from '../types';

export interface SyncResult {
  newGames: Game[];
  updatedGames: Game[];
  removedGames: Game[];
}

export function sync(
  userId: number,
  newBggData: BggGameData[],
  userCollection: Collection,
): SyncResult {
  const userGames = userCollection?.games ?? [];

  //console.log('user games', userGames);

  const existingGames: Record<string, Game> = {};
  userGames.forEach((g) => {
    const id = getUniqueId(g);
    existingGames[id] = g;
  });

  //const key0 = Object.keys(existingGames)[0];
  //console.log('existingGames[0]', existingGames[key0]);
  //console.log('newBggData[0]', newBggData[0]);

  // keeps track of how many copies of each game exist (should be 1)
  const bggDuplicateCopyTracker: Record<string, number> = {};

  const newGames: Game[] = [];
  const updatedGames: Game[] = [];
  newBggData.forEach((data: BggGameData) => {
    const game = bggDataToGame(data, userId, userCollection);

    const id = getUniqueId(game);

    if (existingGames[id]) {
      if (bggDuplicateCopyTracker[id]) {
        console.log(`*** duplicate bgg game data`, data);
      }

      bggDuplicateCopyTracker[id] = bggDuplicateCopyTracker[id]
        ? bggDuplicateCopyTracker[id] + 1
        : 1;

      updatedGames.push({
        ...existingGames[id],
        ...game,
      });
    } else {
      newGames.push(game);
    }
  });

  const dupCounts = Object.values(bggDuplicateCopyTracker).filter((v) => v > 1);
  const duplicates = dupCounts.reduce((a, b) => a + b, 0) - dupCounts.length;
  console.log(`Total duplicates: ${duplicates}`);

  const removedGames: Game[] = [];
  const allGamesAccountedFor = newBggData.length >= userGames.length;

  console.log(
    `Sync: remove check all games accounted for: ${allGamesAccountedFor} (${newBggData.length} >= ${userGames.length})`,
  );

  if (!allGamesAccountedFor) {
    userGames.forEach((ug) => {
      if (!newBggData.some((g) => g.bggId === `${ug.bggId}`)) {
        removedGames.push(ug);
      }
    });
  }

  return {
    newGames,
    updatedGames,
    removedGames,
  };
}

export function bggDataToGame(
  data: BggGameData,
  userId: number,
  collection: Collection,
): Game {
  const { bggId, name, versionId, owned, previouslyOwned } = data;

  const game: Game = {
    userId,
    bggId: numeric(bggId) ?? 0,
    versionId: numeric(versionId) ?? 0,
    name,
    versionName: data.versionName ?? null,
    collection,
    yearPublished: numeric(data.yearPublished) ?? null,
    bggRank: numeric(data.bggRank) ?? null,
    bggRating: numeric(data.bggRating) ?? null,
    imageUrl: data.imageUrl ?? null,
    thumbnailUrl: data.thumbnailUrl ?? null,
    length: numeric(data.length) ?? null,
    width: numeric(data.width) ?? null,
    depth: numeric(data.depth) ?? null,
    owned: Boolean(owned),
    previouslyOwned: Boolean(previouslyOwned),
    plays: numeric(data.plays) ?? 0,
    rating: numeric(data.rating) ?? 0,
  };

  return game;
}

function getUniqueId(game: Partial<Game>) {
  return `${game.bggId}_${game.versionId ?? 0}`;
}

function numeric(value?: string) {
  if (typeof value === 'undefined' || isNaN(+value)) {
    return undefined;
  } else {
    return +value;
  }
}
