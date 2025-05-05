import { createMock } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BggService } from '@src/bgg';
import { ServiceResult } from '@src/common';
import { Collection } from '@src/entities';
import { mockAuthUser } from '../../test/utils';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

const mockBggService = createMock<BggService>();
const mockService = createMock<CollectionService>();

const user = mockAuthUser();

describe('CollectionController', () => {
  let controller: CollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionController],
      providers: [
        { provide: BggService, useValue: mockBggService },
        { provide: CollectionService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<CollectionController>(CollectionController);
  });

  describe('get', () => {
    it('should call the service method', async () => {
      await controller.get(user);
      expect(mockService.defaultCollection).toHaveBeenCalled();
    });

    it('returns the first collection found', async () => {
      const collections = [
        { id: 0, name: 'test0', games: [] },
        { id: 1, name: 'test1', games: [] },
      ] as unknown as Collection[];

      mockService.defaultCollection.mockResolvedValueOnce(collections[0]);

      const result = await controller.get(user);

      expect(result).toEqual(collections[0]);
    });
  });

  describe('sync collection', () => {
    it('should call the service method and return sync results', async () => {
      const content = {
        new: 1,
        updated: 2,
        removed: 3,
      };
      mockBggService.syncCollections.mockResolvedValueOnce({
        result: ServiceResult.Success,
        content,
      });

      const result = await controller.sync(user);

      expect(mockBggService.syncCollections).toHaveBeenCalledWith(user);
      expect(result).toEqual(content);
    });

    it('returns a error status and message from the bgg service if error', async () => {
      mockBggService.syncCollections.mockResolvedValueOnce({
        result: ServiceResult.InvalidBggUser,
      });

      await expect(controller.sync(user)).rejects.toThrow(BadRequestException);
    });
  });
});
