import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { mockAuthUser } from '../../test/utils';
import { UserAuthRecord } from '../auth';
import { BggController } from './bgg.controller';
import { BggService } from './bgg.service';

const mockService = createMock<BggService>();

const user: UserAuthRecord = mockAuthUser();

describe('BggController', () => {
  let controller: BggController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BggController],
      providers: [{ provide: BggService, useValue: mockService }],
    }).compile();

    controller = module.get<BggController>(BggController);
  });

  describe('sync collection', () => {
    it('should call the service method', async () => {
      const res = createMock<Response>();
      await controller.sync(res, user);
      expect(mockService.syncCollections).toHaveBeenCalledWith(user);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns a error status and message from the bgg service if error', async () => {
      const res = createMock<Response>();

      mockService.syncCollections.mockResolvedValueOnce({
        status: 400,
        message: 'Test',
        data: '',
      });

      await controller.sync(res, user);

      expect(res.status).toHaveBeenCalledWith(400);
      //expect(res.send).toHaveBeenCalledWith('Test');
    });
  });
});
