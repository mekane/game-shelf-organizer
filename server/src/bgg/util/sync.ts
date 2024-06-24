import { Collection } from '../../entities';
import { Game } from '../../entities/';
import { BggGameData } from '../types';

export enum DuplicateMode {
  Include, // include multiple copies using an extended bggId
  Newest, // only include the newest instance of the duplicate game
  Oldest, // only include the oldest instance of the duplicate game
}

export interface SyncOptions {
  duplicate: DuplicateMode;
}

export interface SyncResult {
  newGames: Partial<Game>[];
  updatedGames: Partial<Game>[];
  removedGames: Partial<Game>[];
}

export function sync(
  newBggData: BggGameData[],
  userCollection: Collection,
  options: SyncOptions = { duplicate: DuplicateMode.Newest },
): SyncResult {
  console.log(options);

  const userGames = userCollection?.games ?? [];

  //console.log('user games', userGames);

  const existingGamesByBggId: Record<string, Game> = {};
  userGames.forEach((g) => {
    existingGamesByBggId[g.bggId] = g;
  });

  console.log('gamesByBggId', existingGamesByBggId);

  const newGames: Partial<Game>[] = [];
  const updatedGames: Partial<Game>[] = [];
  newBggData.forEach((data: BggGameData) => {
    const game = bggDataToGame(data);
    game.collection = userCollection;
    if (existingGamesByBggId[data.bggId]) {
      updatedGames.push({
        ...existingGamesByBggId[data.bggId],
        ...game,
      });
    } else {
      newGames.push(game);
    }
  });

  const removedGames: Partial<Game>[] = [];
  if ([...newGames, ...updatedGames].length < userGames.length) {
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

function numeric(value: string) {
  if (typeof value === 'undefined' || isNaN(+value)) {
    return undefined;
  } else {
    return +value;
  }
}
