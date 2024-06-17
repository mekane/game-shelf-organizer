import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionService, Result } from './collection.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';
import { Collection } from './entities';

const repositoryKey = getRepositoryToken(Collection);
const mockRepository = createMock<Repository<Collection>>();

const createDto: CreateCollectionDto = {
  name: 'Test',
};

const updateDto: UpdateCollectionDto = {
  name: 'Test Updated',
};

describe('CollectionService', () => {
  let service: CollectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionService,
        {
          provide: repositoryKey,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CollectionService>(CollectionService);
  });

  describe('create', () => {
    it('should call the repository method', async () => {
      await service.create(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should call the repository method', async () => {
      await service.findAll();
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call the repository method', async () => {
      await service.findOne(1);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return NOT_FOUND result for non-existant ids', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await service.findOne(99);
      expect(result).toEqual(Result.NOT_FOUND);
    });
  });

  describe('update', () => {
    it('should call the repository method', async () => {
      const existingData = { id: 1, ...createDto };
      mockRepository.findOneBy.mockResolvedValueOnce(existingData);

      const expectedSave = {
        ...existingData,
        ...updateDto,
      };

      await service.update(1, updateDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedSave);
    });

    it('should return NOT_FOUND result for non-existant ids', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await service.update(99, updateDto);
      expect(result).toEqual(Result.NOT_FOUND);
    });
  });

  describe('remove', () => {
    it('should call the repository method', async () => {
      await service.remove(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return NOT_FOUND result for non-existant ids', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await service.remove(99);
      expect(result).toEqual(Result.NOT_FOUND);
    });
  });
});
