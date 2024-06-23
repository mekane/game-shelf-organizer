import { Injectable } from '@nestjs/common';
import { Game } from 'src/entities/Game.entity';
import { ElementCompact, xml2js } from 'xml-js';
import { UserAuthRecord } from '../auth';
import { CollectionService } from '../collection/collection.service';
import { BggDataFetchResult, BggGameData, BggRank, BggXmlItem } from './types';
import { fetchCollectionData } from './util/fetch';

export enum Result {
  INVALID_BGG_USER,
}

export interface BggSyncResult {
  collectionId: number;
  new: number;
  updated: number;
  removed: number;
}

@Injectable()
export class BggService {
  constructor(private readonly collectionService: CollectionService) {}

  public async syncCollections(
    user: UserAuthRecord,
  ): Promise<BggSyncResult | BggDataFetchResult> {
    console.log('sync collections for ' + user.bggUserName);

    const fetchResult = await this.getCollection(user.bggUserName);

    if ((fetchResult as BggDataFetchResult).status >= 400) {
      return fetchResult as BggDataFetchResult;
    }

    //console.log('BGG collection result', fetchResult);
    const newBggData = fetchResult as BggGameData[];

    const userCollections = await this.collectionService.findAll(user);
    const userCollection = userCollections[0];
    const userGames = userCollection?.games ?? [];

    //console.log('user games', userGames);

    const gamesByBggId: Record<string, Game> = {};
    userGames.forEach((g) => {
      gamesByBggId[g.bggId] = g;
    });

    const newGames: Partial<Game>[] = [];
    const updateGames: Partial<Game>[] = [];
    newBggData.forEach((data: BggGameData) => {
      const game = this.bggDataToGame(data);
      game.collection = userCollection;
      if (gamesByBggId[data.bggId]) {
        updateGames.push({
          ...gamesByBggId[data.bggId],
          ...game,
        });
      } else {
        newGames.push(game);
      }
    });

    const originalLength = userGames.length;
    const updatedGames = [...newGames, ...updateGames];

    const updateDto = {
      ...userCollection,
      games: updatedGames,
    };

    let removed = 0;
    console.log(
      `Updated ${updatedGames.length}, previously had ${originalLength}`,
    );
    if (updatedGames.length < originalLength) {
      removed = originalLength - updatedGames.length;
      // console.log(`${removed} games removed`);
    }
    await this.collectionService.update(user, userCollection.id, updateDto);

    return {
      collectionId: userCollection.id,
      new: newGames.length,
      updated: updateGames.length,
      removed,
    };
  }

  public async getCollection(
    bggUsername: string,
    retries: number = 3,
    delay: number = 2000,
  ) {
    let attempt = 1;

    let result = await fetchCollectionData(bggUsername);
    console.log(`Fetch BGG Collection attempt ${attempt}: ${result.message}`);

    if (result.status >= 400) {
      return result;
    }

    while (result.status === 202 && attempt <= retries) {
      attempt++;
      await new Promise((r) => setTimeout(r, delay));
      result = await fetchCollectionData(bggUsername);
      console.log(`Fetch BGG Collection attempt ${attempt}: ${result.message}`);
    }

    return this.parseCollectionData(result.data);
  }

  public parseCollectionData(xml: string): BggGameData[] {
    try {
      const root: ElementCompact = xml2js(xml, { compact: true, trim: true });
      //   const totalItems = root.items._attributes?.totalitems;
      //   console.log(`Root list says ${totalItems} total items`);

      return root.items?.item.map(this.xmlItemToBggGameData) ?? [];
    } catch (e) {
      console.error('Error parsing collection XML', e);
      return [];
    }
  }

  private xmlItemToBggGameData(obj: BggXmlItem): BggGameData {
    const rankData = obj.stats?.rating?.ranks?.rank;

    let rank: BggRank | undefined;
    if (Array.isArray(rankData)) {
      rank = rankData.find((r) => r._attributes.name === 'boardgame');
    } else {
      rank = rankData;
    }

    const version = obj.version?.item ?? {};

    let yearPublished = obj.yearpublished?._text;
    if (!yearPublished) {
      yearPublished = version.yearpublished?._attributes?.value ?? 'unknown';
    }

    return {
      name: obj.name?._text,
      rating: obj.stats?.rating?._attributes?.value,
      plays: obj.numplays?._text,
      bggId: obj._attributes?.objectid,
      bggRank: rank?._attributes?.value ?? 'unknown',
      bggRating: rank?._attributes?.bayesaverage ?? 'unknown',
      imageUrl: obj.image?._text,
      thumbnailUrl: obj.thumbnail?._text,
      yearPublished,
      owned: obj.status._attributes.own === '1',
      previouslyOwned: obj.status._attributes.prevowned === '1',
      versionName: version.name?._attributes?.value ?? '',
      width: version.width?._attributes?.value ?? 'unknown',
      length: version.length?._attributes?.value ?? 'unknown',
      depth: version.depth?._attributes?.value ?? 'unknown',
    };
  }

  public bggDataToGame(data: BggGameData): Partial<Game> {
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
