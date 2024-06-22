import { Injectable } from '@nestjs/common';
import { CollectionType } from 'src/entities';
import { ElementCompact, xml2js } from 'xml-js';
import { UserAuthRecord } from '../auth';
import { CollectionService } from '../collection/collection.service';
import { BggDataFetchResult, BggGameData, BggRank, BggXmlItem } from './types';

export enum Result {
  INVALID_BGG_USER,
}

export interface BggSyncResult {
  owned: number;
  previouslyOwned: number;
  played: number;
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

    console.log('COLLECTION result', fetchResult);
    const collection = fetchResult as BggGameData[];

    const userCollections = await this.collectionService.getStandardSet(user);
    const owned = userCollections[CollectionType.Owned];
    const previous = userCollections[CollectionType.PreviouslyOwned];
    const wishList = userCollections[CollectionType.WishList];
    const played = userCollections[CollectionType.Played];
    console.log('Before sync:');
    console.log(`  owned: ${owned?.name}`);
    console.log(`  previous: ${previous?.name}`);
    console.log(`  wishList: ${wishList?.name}`);
    console.log(`  played: ${played?.name}`);

    return {
      owned: collection.length,
      previouslyOwned: 0,
      played: 0,
    };
  }

  public async getCollection(
    bggUsername: string,
    retries: number = 3,
    delay: number = 2000,
  ) {
    let attempt = 1;

    let result = await this.fetchCollectionData(bggUsername);
    console.log(`Fetch BGG Collection attempt ${attempt}: ${result.message}`);

    if (result.status >= 400) {
      return result;
    }

    while (result.status === 202 && attempt <= retries) {
      attempt++;
      await new Promise((r) => setTimeout(r, delay));
      result = await this.fetchCollectionData(bggUsername);
      console.log(`Fetch BGG Collection attempt ${attempt}: ${result.message}`);
    }

    return this.parseCollectionData(result.data);
  }

  /**
   * Makes initial API call, which can queue up and return a 202
   * In this case the system needs to pause and try again in a little while
   * at which point the status should be a 200 and data will be available.
   * Note that the BGG api returns status 200 with an error message in case
   * something went wrong, so we have to check for that and parse it specially.
   * @param bggUsername required
   */
  public async fetchCollectionData(
    bggUsername: string,
  ): Promise<BggDataFetchResult> {
    const response = await fetch(this.getBggCollectionUrl(bggUsername));

    if (response.status === 200) {
      const xml = await response.text();

      if (xml.match('<errors>')) {
        const error = this.parseError(xml);
        return {
          status: 400,
          message: error,
          data: '',
        };
      }

      return {
        status: 200,
        message: 'Success',
        data: xml,
      };
    } else {
      return {
        status: response.status,
        message: response.statusText,
        data: '',
      };
    }
  }

  private getBggCollectionUrl(user: string): string {
    return `https://boardgamegeek.com/xmlapi2/collection?excludesubtype=boardgameexpansion&played=1&stats=1&version=1&username=${user}`;
  }

  private parseError(xml: string): string {
    const json: ElementCompact = xml2js(xml, { compact: true, trim: true });
    return json['errors']?.error?.message?._text;
  }

  public parseCollectionData(xml: string): BggGameData[] {
    try {
      const root: ElementCompact = xml2js(xml, { compact: true, trim: true });
      //   const totalItems = root.items._attributes?.totalitems;
      //   console.log(`Root list says ${totalItems} total items`);

      return root.items?.item.map(this.xmlItemToBggGameData);
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
}
