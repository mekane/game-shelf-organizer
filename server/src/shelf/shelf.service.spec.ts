import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockAuthUser } from '../../test/utils';
import { Shelf } from '../entities';
import { CreateShelfDto, UpdateShelfDto } from './dto';
import { Result, ShelfService } from './shelf.service';

const repositoryKey = getRepositoryToken(Shelf);
const mockRepository = createMock<Repository<Shelf>>();

const createDto: CreateShelfDto = {
  name: 'Test',
};

const updateDto: UpdateShelfDto = {
  name: 'Test Updated',
};

const user = mockAuthUser();

describe('ShelfService', () => {
  let service: ShelfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShelfService,
        {
          provide: repositoryKey,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ShelfService>(ShelfService);
  });

  describe('create', () => {
    it('should call the repository method', async () => {
      await service.create(user, createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should call the repository method', async () => {
      await service.findAll(user);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call the repository method', async () => {
      await service.findOne(user, 1);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return NOT_FOUND result for non-existant ids', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await service.findOne(user, 99);
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

      await service.update(user, 1, updateDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedSave);
    });

    it('should return NOT_FOUND result for non-existant ids', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await service.update(user, 99, updateDto);
      expect(result).toEqual(Result.NOT_FOUND);
    });
  });

  describe('remove', () => {
    it('should call the repository method', async () => {
      await service.remove(user, 1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return NOT_FOUND result for non-existant ids', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await service.remove(user, 99);
      expect(result).toEqual(Result.NOT_FOUND);
    });
  });
});
