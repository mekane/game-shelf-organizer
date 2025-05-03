import { Collection } from '../../entities';
import { Game } from '../../entities/';
import { BggGameData } from '../types';

export interface SyncResult {
  newGames: Partial<Game>[];
  updatedGames: Partial<Game>[];
  removedGames: Partial<Game>[];
}

export function sync(
  newBggData: BggGameData[],
  userCollection: Collection,
): SyncResult {
  const userGames = userCollection?.games ?? [];

  //console.log('user games', userGames);

  const existingGames: Record<string, Game> = {};
  userGames.forEach((g) => {
    const id = getPrimaryId(g);
    existingGames[id] = g;
  });

  //const key0 = Object.keys(existingGames)[0];
  //console.log('existingGames[0]', existingGames[key0]);
  //console.log('newBggData[0]', newBggData[0]);

  const newGames: Partial<Game>[] = [];
  const updatedGames: Partial<Game>[] = [];
  newBggData.forEach((data: BggGameData) => {
    const game = bggDataToGame(data);
    game.collection = userCollection;

    const id = getPrimaryId(game);

    if (existingGames[id]) {
      updatedGames.push({
        ...existingGames[data.bggId],
        ...game,
      });
    } else {
      newGames.push(game);
    }
  });

  const removedGames: Partial<Game>[] = [];
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

export function bggDataToGame(data: BggGameData): Partial<Game> {
  const {
    bggId,
    name,
    yearPublished,
    bggRank,
    bggRating,
    plays,
    rating,
    imageUrl,
    thumbnailUrl,
    versionId,
    versionName,
    length,
    width,
    depth,
    owned,
    previouslyOwned,
  } = data;

  const game = {
    bggId: numeric(bggId),
    name,
    imageUrl,
    thumbnailUrl,
    owned: !!+owned,
    previouslyOwned: !!+previouslyOwned,
  };

  addNumberWithDefault(game, versionId, 'versionId');
  addIfDefined(game, versionName, 'versionName');
  addIfNumeric(game, yearPublished, 'yearPublished');
  addIfNumeric(game, bggRank, 'bggRank');
  addIfNumeric(game, bggRating, 'bggRating');
  addIfNumeric(game, plays, 'plays');
  addIfNumeric(game, rating, 'rating');
  addIfNumeric(game, length, 'length');
  addIfNumeric(game, width, 'width');
  addIfNumeric(game, depth, 'depth');

  return game;
}

function getPrimaryId(game: Partial<Game>) {
  return `${game.bggId}_${game.versionId ?? 0}`;
}

function addIfNumeric(obj: any, value: string, key: string) {
  const isEmptyString = typeof value === 'string' && value.trim() === '';
  const isNull = value === null;

  if (isEmptyString || isNull) {
    return obj;
  }
  return addIfDefined(obj, numeric(value), key);
}

function addIfDefined(obj: any, value: any, key: string) {
  if (typeof value !== 'undefined') {
    obj[key] = value;
  }
  return obj;
}

function addNumberWithDefault(obj: any, value: string, key: string) {
  const num = numeric(value);
  if (num) {
    obj[key] = num;
  } else {
    obj[key] = 0;
  }
}

function numeric(value: string) {
  if (typeof value === 'undefined' || isNaN(+value)) {
    return undefined;
  } else {
    return +value;
  }
}
