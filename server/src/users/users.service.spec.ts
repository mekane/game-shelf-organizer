import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockAuthUser } from '../../test/utils';
import { User } from '../entities';
import { CreateUserDto, UpdateUserDto, UserLoginDto } from './dto';
import { Result, UsersService } from './users.service';

const repositoryKey = getRepositoryToken(User);
const mockRepository = createMock<Repository<User>>({
  findOneBy: jest.fn().mockResolvedValue(null),
});

const existingUser: User = new User();

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

const user = mockAuthUser();

const mockJwtService = createMock<JwtService>();

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: repositoryKey,
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should call the repository method', async () => {
      await service.create(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
    });

    it('should return an error if the email is already in use', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(existingUser);

      const result = await service.create(createDto);
      expect(result).toEqual(Result.EMAIL_IN_USE);
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
      const existingData = { id: 1, isAdmin: false, ...createDto };
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

    it('should return EMAIL_IN_USE for existing email', async () => {
      const existingEmail = 'existing@example.com';
      const existingUser = new User();
      existingUser.email = 'another@example.com';
      // check that user to update exists
      mockRepository.findOneBy.mockResolvedValueOnce(existingUser);
      // check whether a user exists with the email in the DTO
      mockRepository.findOneBy.mockResolvedValueOnce(new User());

      const updateExisting = {
        ...updateDto,
        email: existingEmail,
      };

      const result = await service.update(existingUser.id, updateExisting);
      expect(result).toEqual(Result.EMAIL_IN_USE);
    });

    it('should not return an error if not changing existing email', async () => {
      const existingEmail = 'existing@example.com';
      const existingUser = new User();
      existingUser.email = existingEmail;
      mockRepository.findOneBy.mockResolvedValueOnce(existingUser);

      const updateExisting = {
        ...updateDto,
        email: existingEmail,
      };

      await service.update(existingUser.id, updateExisting);
      expect(mockRepository.save).toHaveBeenCalledWith(updateExisting);
    });
  });

  describe('remove', () => {
    it('should call the repository method', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(existingUser);

      await service.remove(user, 1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return NOT_FOUND result for non-existant ids', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      const result = await service.remove(user, 99);
      expect(result).toEqual(Result.NOT_FOUND);
    });

    it('should return an error if trying to delete own user', async () => {
      const existingUser = new User();
      existingUser.id = user.sub;
      mockRepository.findOneBy.mockResolvedValueOnce(existingUser);

      const result = await service.remove(user, 99);
      expect(result).toEqual(Result.OWN_USER);
    });
  });

  describe('login', () => {
    it('returns error if no user found with the given email', async () => {
      const loginNoUser: UserLoginDto = {
        email: 'not-found@email.com',
        password: 'any',
      };
      mockRepository.findOneBy.mockResolvedValueOnce(null);

      const result = await service.login(loginNoUser);
      expect(result).toEqual(Result.INVALID_CREDENTIALS);
    });

    it('returns error if password does not match', async () => {
      const loginBadPass: UserLoginDto = {
        email: 'user@email.com',
        password: 'bad',
      };
      mockRepository.findOneBy.mockResolvedValueOnce(existingUser);

      const result = await service.login(loginBadPass);
      expect(result).toEqual(Result.INVALID_CREDENTIALS);
    });

    it('returns jwt access token', async () => {
      const existingUser = {
        ...createDto,
        id: 1,
        email: 'user@rmail.com',
        password: 'ok',
        isAdmin: false,
      };
      mockRepository.findOneBy.mockResolvedValueOnce(existingUser);

      const loginOk: UserLoginDto = {
        email: existingUser.email,
        password: existingUser.password,
      };

      const token = 'akasjhdaksdjaksjdh';
      mockJwtService.signAsync.mockResolvedValueOnce(token);

      const result = await service.login(loginOk);
      expect(result).toEqual({ access_token: token });
    });
  });
});
