import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CollectionController } from './collection.controller';
import { CollectionService, Result } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

const mockService = createMock<CollectionService>();

const createDto: CreateCollectionDto = {
  name: 'Test',
};

const updateDto: UpdateCollectionDto = {
  name: 'Test Updated',
};

describe('CollectionController', () => {
  let controller: CollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionController],
      providers: [{ provide: CollectionService, useValue: mockService }],
    }).compile();

    controller = module.get<CollectionController>(CollectionController);
  });

  describe('create', () => {
    it('should call the service method', async () => {
      await controller.create(createDto);
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should call the service method', async () => {
      await controller.findAll();
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call the service method', async () => {
      await controller.findOne('1');
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });

    it('returns a 404 if the specified id is not found', async () => {
      mockService.findOne.mockResolvedValueOnce(Result.NOT_FOUND);

      const findOneNotFound = () => controller.findOne('not found');
      expect(findOneNotFound).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should call the service method', async () => {
      await controller.update('1', updateDto);
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('returns a 404 if the specified id is not found', async () => {
      mockService.update.mockResolvedValueOnce(Result.NOT_FOUND);

      const updateNotFound = () => controller.update('not found', updateDto);
      expect(updateNotFound).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call the service method', async () => {
      await controller.remove('1');
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });

    it('returns a 404 if the specified id is not found', async () => {
      mockService.remove.mockResolvedValueOnce(Result.NOT_FOUND);

      const removeNotFound = () => controller.remove('not found');
      expect(removeNotFound).rejects.toThrow(NotFoundException);
    });
  });
});
