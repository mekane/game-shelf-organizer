import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockAuthUser } from '../../test/utils';
import { List, User } from '../entities';
import { CreateListDto, UpdateListDto } from './dto';
import { ListService, Result } from './list.service';

const repositoryKey = getRepositoryToken(List);
const mockRepository = createMock<Repository<List>>();

const createDto: CreateListDto = {
  name: 'Test',
};

const updateDto: UpdateListDto = {
  name: 'Test Updated',
};

const user = mockAuthUser();

describe('ListService', () => {
  let service: ListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
        {
          provide: repositoryKey,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ListService>(ListService);
  });

  describe('create', () => {
    it('should call the repository method', async () => {
      await service.create(user, createDto);

      const expectedSave = {
        ...createDto,
        user: { id: user.id },
      };

      expect(mockRepository.save).toHaveBeenCalledWith(expectedSave);
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
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        id: user.id,
        user: { id: user.id },
      });
    });

    it('should return NOT_FOUND result for non-existant ids', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await service.findOne(user, 99);
      expect(result).toEqual(Result.NOT_FOUND);
    });
  });

  describe('update', () => {
    it('should call the repository method', async () => {
      const existingData = { id: 1, user: new User(), ...createDto };
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
