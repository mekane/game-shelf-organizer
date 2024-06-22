import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockAuthUser } from '../../test/utils';
import { Collection, CollectionType, User } from '../entities';
import { CollectionService, Result } from './collection.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';

const repositoryKey = getRepositoryToken(Collection);
const mockRepository = createMock<Repository<Collection>>();

const createDto: CreateCollectionDto = {
  name: 'Test',
  type: CollectionType.Other,
};

const updateDto: UpdateCollectionDto = {
  name: 'Test Updated',
};

const authUser = mockAuthUser();

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
      await service.create(authUser, createDto);

      const expectedSave = {
        ...createDto,
        user: { id: authUser.sub },
      };

      expect(mockRepository.save).toHaveBeenCalledWith(expectedSave);
    });
  });

  describe('findAll', () => {
    it('should call the repository method', async () => {
      await service.findAll(authUser);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          user: { id: authUser.id },
        },
      });
    });
  });

  describe('getStandardSet', () => {
    const user = { id: authUser.id } as User;
    const allCollections: Collection[] = [
      { id: 0, name: 'Owned 0', user, type: CollectionType.Owned },
      { id: 1, name: 'Owned 1', user, type: CollectionType.Owned },
      { id: 2, name: 'Prev 2', user, type: CollectionType.PreviouslyOwned },
      { id: 3, name: 'Other 3', user, type: CollectionType.Other },
      { id: 4, name: 'Wish 4', user, type: CollectionType.WishList },
      { id: 5, name: 'Played 5', user, type: CollectionType.Played },
      { id: 6, name: 'Other 6', user, type: CollectionType.Other },
    ];

    it('finds a collection of each type for the user', async () => {
      mockRepository.find.mockResolvedValueOnce(allCollections);
      const result = await service.getStandardSet(authUser);

      expect(result).toEqual({
        [CollectionType.Owned]: allCollections[0],
        [CollectionType.PreviouslyOwned]: allCollections[2],
        [CollectionType.WishList]: allCollections[4],
        [CollectionType.Played]: allCollections[5],
      });
    });
  });

  describe('findOne', () => {
    it('should call the repository method', async () => {
      await service.findOne(authUser, 1);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        id: authUser.id,
        user: { id: authUser.id },
      });
    });

    it('should return NOT_FOUND result for non-existant ids', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await service.findOne(authUser, 99);
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

      await service.update(authUser, 1, updateDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedSave);
    });

    it('should return NOT_FOUND result for non-existant ids', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await service.update(authUser, 99, updateDto);
      expect(result).toEqual(Result.NOT_FOUND);
    });
  });

  describe('remove', () => {
    it('should call the repository method', async () => {
      await service.remove(authUser, 1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return NOT_FOUND result for non-existant ids', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await service.remove(authUser, 99);
      expect(result).toEqual(Result.NOT_FOUND);
    });
  });
});
