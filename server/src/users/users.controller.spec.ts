import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthRecord } from '@src/auth';
import { mockAuthUser } from '../../test/utils';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersController } from './users.controller';
import { Result, UsersService } from './users.service';

const mockService = createMock<UsersService>();

const createDto: CreateUserDto = {
  email: 'test@email.com',
  firstName: 'Test',
  lastName: 'User',
  bggUserName: 'bgg',
  password: 'abc123',
};

const updateDto: UpdateUserDto = {
  firstName: 'Test Updated',
};

const user: UserAuthRecord = mockAuthUser();

describe('UserController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('create', () => {
    it('should call the service method', async () => {
      await controller.create(createDto);
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });

    it('returns a 400 if the email is already taken', async () => {
      mockService.create.mockResolvedValueOnce(Result.EMAIL_IN_USE);

      const createInUse = () => controller.create(createDto);
      expect(createInUse).rejects.toThrow(BadRequestException);
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

    it('returns a 400 if updating to an email already in use', async () => {
      mockService.update.mockResolvedValueOnce(Result.EMAIL_IN_USE);

      const updateInUse = () => controller.update('1', updateDto);
      expect(updateInUse).rejects.toThrow(BadRequestException);
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

    it('returns a 400 if trying to delete own user', async () => {
      mockService.remove.mockResolvedValueOnce(Result.OWN_USER);

      const removeNotFound = () => controller.remove(user, 'self');
      expect(removeNotFound).rejects.toThrow(BadRequestException);
    });
  });
});
