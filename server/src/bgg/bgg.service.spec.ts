import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CollectionService } from '../collection/collection.service';
import { BggService } from './bgg.service';
import { BggGameData } from './types';
import { successfulXml } from './util/test.xml';

describe('BggService', () => {
  let service: BggService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BggService,
        {
          provide: CollectionService,
          useValue: createMock<CollectionService>(),
        },
      ],
    }).compile();

    service = module.get<BggService>(BggService);
  });

  describe('parse bgg xml data', () => {
    it('returns an empty array for invalid xml', () => {
      expect(service.parseCollectionData('')).toEqual([]);
      expect(service.parseCollectionData('1')).toEqual([]);
      expect(service.parseCollectionData('foobar')).toEqual([]);
      expect(service.parseCollectionData('[<item></item>]')).toEqual([]);
      expect(service.parseCollectionData('{}')).toEqual([]);
      expect(service.parseCollectionData('<errors></errors>')).toEqual([]);
    });

    //it handles broken xml? missing end tags?

    it('parses the items in the results and returns object', () => {
      const result = service.parseCollectionData(successfulXml);

      expect(result).toEqual([
        {
          bggId: '373167',
          bggRank: '1776',
          bggRating: '6.2738',
          imageUrl: 'https://images.com/original/img/pic7720772.png',
          name: '20 Strong',
          owned: true,
          plays: '7',
          previouslyOwned: false,
          rating: 'N/A',
          thumbnailUrl: 'https://images.com/thumb/img/pic7720772.png',
          yearPublished: '2023',
          versionName: '',
          length: 'unknown',
          width: 'unknown',
          depth: 'unknown',
        },
        {
          bggId: '2094',
          bggRank: '25792',
          bggRating: '5.45672',
          imageUrl: 'https://images.com/original/img/pic2601726.jpg',
          name: '4 First Games',
          owned: false,
          plays: '19',
          previouslyOwned: true,
          rating: '5',
          thumbnailUrl: 'https://images.com/thumb/img/pic2601726.jpg',
          yearPublished: '2000',
          versionName: 'English-only edition',
          length: '13.25',
          width: '9',
          depth: '2.25',
        },
      ]);
    });
  });

  describe('sync collections', () => {
    it('fetches collections for user and updates with game data', async () => {});
  });

  describe('bggDataToGame', () => {
    it('always includes bggId, name, image urls, and owned', () => {
      expect(service.bggDataToGame({} as BggGameData)).toEqual({
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

      expect(service.bggDataToGame(data)).toEqual({
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

      expect(service.bggDataToGame(data)).toEqual({
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

      expect(service.bggDataToGame(data)).toEqual({
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

      expect(service.bggDataToGame(data)).toEqual({
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
