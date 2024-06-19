import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockAuthUser } from '../../test/utils';
import { CreateShelfDto, UpdateShelfDto } from './dto';
import { ShelfController } from './shelf.controller';
import { Result, ShelfService } from './shelf.service';

const mockService = createMock<ShelfService>();

const createDto: CreateShelfDto = {
  name: 'Test',
};

const updateDto: UpdateShelfDto = {
  name: 'Test Updated',
};

const user = mockAuthUser();

describe('ShelfController', () => {
  let controller: ShelfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShelfController],
      providers: [{ provide: ShelfService, useValue: mockService }],
    }).compile();

    controller = module.get<ShelfController>(ShelfController);
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
      mockService.findOne.mockResolvedValueOnce(Result.NOT_FOUND);

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
      mockService.update.mockResolvedValueOnce(Result.NOT_FOUND);

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
      mockService.remove.mockResolvedValueOnce(Result.NOT_FOUND);

      const removeNotFound = () => controller.remove(user, 'not found');
      expect(removeNotFound).rejects.toThrow(NotFoundException);
    });
  });
});
