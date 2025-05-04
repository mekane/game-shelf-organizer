import { Injectable } from '@nestjs/common';
import { GamesService } from 'src/games/games.service';
import { UserAuthRecord } from '../auth';
import { CollectionService } from '../collection/collection.service';
import { BggDataFetchResult, BggGameData } from './types';
import { fetchCollectionData } from './util/fetch';
import { parseCollectionData } from './util/parse';
import { sync } from './util/sync';

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
  constructor(
    private readonly collectionService: CollectionService,
    private readonly gamesService: GamesService,
  ) {}

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

    return parseCollectionData(result.data);
  }

  public async syncCollections(
    user: UserAuthRecord,
  ): Promise<BggSyncResult | BggDataFetchResult> {
    console.log('sync collection for ' + user.bggUserName);

    const fetchResult = await this.getCollection(user.bggUserName);

    if ((fetchResult as BggDataFetchResult).status >= 400) {
      return fetchResult as BggDataFetchResult;
    }

    //console.log('BGG collection result', fetchResult);
    const newBggData = fetchResult as BggGameData[];

    // default to first collection
    const userCollections = await this.collectionService.findAll(user);
    const userCollection = userCollections[0];

    const { newGames, updatedGames, removedGames } = sync(
      user.id,
      newBggData,
      userCollection,
    );

    const updateDto = {
      ...userCollection,
      games: [...newGames, ...updatedGames],
    };

    if (removedGames.length) {
      await this.gamesService.remove(removedGames);
      console.log(`${removedGames.length} games removed`);
    }

    await this.collectionService.update(user, userCollection.id, updateDto);

    return {
      collectionId: userCollection.id,
      new: newGames.length,
      updated: updatedGames.length,
      removed: removedGames.length,
    };
  }
}
