import { Injectable } from '@nestjs/common';
import { ServiceStatus } from '@src/common';
import { GamesService } from '@src/games/games.service';
import { UserAuthRecord } from '../auth';
import { CollectionService } from '../collection/collection.service';
import { BggGameData } from './types';
import { fetchCollectionData } from './util/fetch';
import { parseCollectionData } from './util/parse';
import { sync } from './util/sync';

export interface BggResult {
  result: ServiceStatus;
  content?: BggGameData[];
  message?: string;
}

export interface SyncResult {
  result: ServiceStatus;
  content?: {
    new: number;
    updated: number;
    removed: number;
  };
  message?: string;
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
  ): Promise<BggResult> {
    let attempt = 1;

    let bggRes = await fetchCollectionData(bggUsername);
    console.log(`Fetch BGG Collection attempt ${attempt}: ${bggRes.message}`);

    if (bggRes.status >= 400) {
      return {
        result: ServiceStatus.InvalidBggUser,
        message: bggRes.message,
      };
    }

    while (bggRes.status === 202 && attempt <= retries) {
      attempt++;
      await new Promise((r) => setTimeout(r, delay));
      bggRes = await fetchCollectionData(bggUsername);
      console.log(`Fetch BGG Collection attempt ${attempt}: ${bggRes.message}`);
    }

    return {
      result: ServiceStatus.Success,
      content: parseCollectionData(bggRes.data),
    };
  }

  public async syncCollections(user: UserAuthRecord): Promise<SyncResult> {
    console.log('sync collection for ' + user.bggUserName);

    const fetchResult = await this.getCollection(user.bggUserName);

    if (fetchResult.result !== ServiceStatus.Success) {
      return {
        result: fetchResult.result,
      };
    }

    //console.log('BGG collection result', fetchResult);
    const newBggData = fetchResult.content ?? [];

    // default to first collection
    const userCollection = await this.collectionService.defaultCollection(user);

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
      result: ServiceStatus.Success,
      content: {
        new: newGames.length,
        updated: updatedGames.length,
        removed: removedGames.length,
      },
    };
  }
}
