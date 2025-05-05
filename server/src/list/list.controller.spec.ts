import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceResult } from '@src/common';
import { mockAuthUser } from '../../test/utils';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListController } from './list.controller';
import { ListService } from './list.service';

const mockService = createMock<ListService>();

const createDto: CreateListDto = {
  name: 'Test',
  games: [],
};

const updateDto: UpdateListDto = {
  name: 'Test Updated',
};

const user = mockAuthUser();

describe('ListController', () => {
  let controller: ListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [{ provide: ListService, useValue: mockService }],
    }).compile();

    controller = module.get<ListController>(ListController);
  });

  describe('create', () => {
    it('should call the service method', async () => {
      await controller.create(user, createDto);
      expect(mockService.create).toHaveBeenCalledWith(user, createDto);
    });
  });

  describe('findAll', () => {
    it('should call the service method', async () => {
      await controller.findAll(user);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call the service method', async () => {
      await controller.findOne(user, '1');
      expect(mockService.findOne).toHaveBeenCalledWith(user, 1);
    });

    it('returns a 404 if the specified id is not found', async () => {
      mockService.findOne.mockResolvedValueOnce({
        result: ServiceResult.NotFound,
      });

      const findOneNotFound = () => controller.findOne(user, 'not found');
      expect(findOneNotFound).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should call the service method', async () => {
      await controller.update(user, '1', updateDto);
      expect(mockService.update).toHaveBeenCalledWith(user, 1, updateDto);
    });

    it('returns a 404 if the specified id is not found', async () => {
      mockService.update.mockResolvedValueOnce({
        result: ServiceResult.NotFound,
      });

      const updateNotFound = () =>
        controller.update(user, 'not found', updateDto);
      expect(updateNotFound).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call the service method', async () => {
      await controller.remove(user, '1');
      expect(mockService.remove).toHaveBeenCalledWith(user, 1);
    });

    it('returns a 404 if the specified id is not found', async () => {
      mockService.remove.mockResolvedValueOnce({
        result: ServiceResult.NotFound,
      });

      const removeNotFound = () => controller.remove(user, 'not found');
      expect(removeNotFound).rejects.toThrow(NotFoundException);
    });
  });
});
