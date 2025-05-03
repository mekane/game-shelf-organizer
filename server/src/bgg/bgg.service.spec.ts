import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CollectionService } from '../collection/collection.service';
import { BggService } from './bgg.service';
import { BggDataFetchResult } from './types';
import * as fetchCollection from './util/fetch';
import * as parseCollection from './util/parse';

jest.mock('./util/fetch', () => ({
  __esModule: true,
  fetchCollectionData: jest.fn(),
}));

jest.mock('./util/parse', () => ({
  __esModule: true,
  parseCollectionData: jest.fn(),
}));

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

  describe('getCollection', () => {
    it('returns error result if the BGG fetch fails', async () => {
      const errorResult = {
        status: 400,
        message: 'example error',
        data: '',
      };
      (fetchCollection.fetchCollectionData as jest.Mock).mockResolvedValueOnce(
        errorResult,
      );
      const result = await service.getCollection('bggName', 1, 1);

      expect(result).toEqual(errorResult);
    });

    it('returns parsed results when fetch is successful and ready', async () => {
      const successResponse = {
        status: 200,
        message: 'success',
        data: ['test'],
      };
      (fetchCollection.fetchCollectionData as jest.Mock).mockResolvedValueOnce(
        successResponse,
      );

      const parsedResponse = ['foo'];
      (parseCollection.parseCollectionData as jest.Mock).mockResolvedValueOnce(
        parsedResponse,
      );

      const result = await service.getCollection('bggName', 1, 1);
      expect(parseCollection.parseCollectionData).toHaveBeenCalledWith(
        successResponse.data,
      );
      expect(result).toEqual(parsedResponse);
    });

    it('retries automatically if the BGG fetch is queued', async () => {
      const acceptResponse: BggDataFetchResult = {
        status: 202,
        message: 'accepted',
        data: '',
      };
      const successResponse = {
        status: 200,
        message: 'success',
        data: ['test'],
      };
      (fetchCollection.fetchCollectionData as jest.Mock)
        .mockReset()
        .mockResolvedValueOnce(acceptResponse)
        .mockResolvedValueOnce(acceptResponse)
        .mockResolvedValueOnce(successResponse);

      await service.getCollection('bggName', 2, 1);
      expect(fetchCollection.fetchCollectionData).toHaveBeenCalledTimes(3);
    });
  });

  describe('syncCollections', () => {
    it('plumbing', async () => {});

    //TODO: test duplicate removal options
  });
});
