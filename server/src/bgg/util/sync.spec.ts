import { Collection, Game } from '../../entities';
import { BggGameData } from '../types';
import { bggDataToGame, sync } from './sync';
import { parsedDuplicateData } from './test.xml';

const emptyCollection = new Collection();
emptyCollection.games = [];

describe('syncing fetched bgg data with an existing Collection', () => {
  describe('sync', () => {
    it('returns empty results if the bgg data is empty', () => {
      const result = sync([], emptyCollection);
      expect(result).toEqual({
        newGames: [],
        updatedGames: [],
        removedGames: [],
      });
    });

    it('adds new games to the collection', () => {
      const newGames: BggGameData[] = [
        { bggId: '0', name: 'game 0' },
        { bggId: '1', name: 'game 1' },
        { bggId: '2', name: 'game 2' },
      ] as BggGameData[];

      const result = sync(newGames, emptyCollection);
      expect(result.newGames).toHaveLength(3);
      expect(result.updatedGames).toHaveLength(0);
      expect(result.removedGames).toHaveLength(0);
    });

    it('updates existing games in the collection', () => {
      const updatedGames: BggGameData[] = [
        { bggId: '0', name: 'game 0' },
        { bggId: '1', name: 'game 1' },
        { bggId: '2', name: 'game 2' },
      ] as BggGameData[];

      const existingCollection = new Collection();
      existingCollection.games = [
        { id: 110, bggId: '0', collection: existingCollection, name: 'game 0' },
        { id: 111, bggId: '1', collection: existingCollection, name: 'game 1' },
        { id: 112, bggId: '2', collection: existingCollection, name: 'game 2' },
      ] as unknown as Game[];

      const result = sync(updatedGames, existingCollection);
      expect(result.newGames).toHaveLength(0);
      expect(result.updatedGames).toHaveLength(3);
      expect(result.removedGames).toHaveLength(0);
    });

    it('tracks games from the collection that no longer exist in the imported data', () => {
      const updatedGames: BggGameData[] = [
        { bggId: '0', name: 'game 0' },
      ] as BggGameData[];

      const existingCollection = new Collection();
      existingCollection.games = [
        { id: 100, bggId: 0, collection: existingCollection, name: 'game 0' },
        { id: 108, bggId: 8, collection: existingCollection, name: 'remo 1' },
        { id: 109, bggId: 9, collection: existingCollection, name: 'remo 2' },
      ] as unknown as Game[];

      const result = sync(updatedGames, existingCollection);
      expect(result.newGames).toHaveLength(0);
      expect(result.updatedGames).toHaveLength(1);
      expect(result.removedGames).toHaveLength(2);
      expect(result.removedGames.map((g) => g.bggId)).toEqual([8, 9]);
    });

    it('keeps the newer version of duplicate games by default', () => {
      const dataWithDupes = parsedDuplicateData;
      const result = sync(dataWithDupes, emptyCollection);
      expect(result.newGames).toHaveLength(1);
      expect(result.updatedGames).toHaveLength(0);
      expect(result.removedGames).toHaveLength(0);
    });
  });

  describe('bggDataToGame', () => {
    it('always includes bggId, name, image urls, and owned', () => {
      expect(bggDataToGame({} as BggGameData)).toEqual({
        bggId: undefined,
        name: undefined,
        imageUrl: undefined,
        thumbnailUrl: undefined,
        owned: false,
        previouslyOwned: false,
      });
    });

    it('adds string values if defined', () => {
      const data = {
        name: 'name',
        imageUrl: 'imageUrl',
        thumbnailUrl: 'thumbnailUrl',
        versionName: 'version',
      } as BggGameData;

      expect(bggDataToGame(data)).toEqual({
        bggId: undefined,
        name: data.name,
        imageUrl: data.imageUrl,
        thumbnailUrl: data.thumbnailUrl,
        versionName: data.versionName,
        owned: false,
        previouslyOwned: false,
      });
    });

    it('adds converted numeric values if defined', () => {
      const data = {
        name: 'name',
        imageUrl: 'imageUrl',
        thumbnailUrl: 'thumbnailUrl',
        versionName: 'version',
        yearPublished: '1',
        bggRank: '2',
        bggRating: '3.5',
        plays: '4',
        rating: '5.6',
        length: '12.1',
        width: '6.0',
        depth: '12',
      } as BggGameData;

      expect(bggDataToGame(data)).toEqual({
        bggId: undefined,
        name: data.name,
        imageUrl: data.imageUrl,
        thumbnailUrl: data.thumbnailUrl,
        versionName: data.versionName,
        owned: false,
        previouslyOwned: false,
        yearPublished: 1,
        bggRank: 2,
        bggRating: 3.5,
        plays: 4,
        rating: 5.6,
        length: 12.1,
        width: 6,
        depth: 12,
      });
    });

    it('skips converted numeric values if invalid', () => {
      const data = {
        name: 'name',
        versionName: 'version',
        yearPublished: '1996',
        bggRank: '',
        bggRating: undefined,
        rating: null,
        length: '     ',
        depth: '123foo',
      } as unknown as BggGameData;

      expect(bggDataToGame(data)).toEqual({
        bggId: undefined,
        name: data.name,
        imageUrl: undefined,
        thumbnailUrl: undefined,
        versionName: data.versionName,
        yearPublished: 1996,
        owned: false,
        previouslyOwned: false,
      });
    });

    it('converts a good example', () => {
      const data = {
        bggId: '3750',
        name: 'Test Game',
        imageUrl: 'http://test.com/img/7',
        thumbnailUrl: 'http://test.com/t/7',
        versionName: 'Old Printing',
        owned: '1',
        previouslyOwned: '0',
        yearPublished: '2007',
        bggRank: '2',
        bggRating: '6.5',
        plays: '6',
        rating: '8.5',
        length: '12.1',
        width: '6.25',
        depth: '12',
      } as unknown as BggGameData;

      expect(bggDataToGame(data)).toEqual({
        bggId: 3750,
        name: data.name,
        imageUrl: data.imageUrl,
        thumbnailUrl: data.thumbnailUrl,
        versionName: data.versionName,
        owned: true,
        previouslyOwned: false,
        yearPublished: 2007,
        bggRank: 2,
        bggRating: 6.5,
        plays: 6,
        rating: 8.5,
        length: 12.1,
        width: 6.25,
        depth: 12,
      });
    });
  });
});
