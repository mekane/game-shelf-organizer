import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RequireAdmin, UserAuthRecord } from '@src/auth';
import { ServiceResult, ServiceStatus } from '@src/common';
import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { UserLoginDto } from './dto/auth';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private secret: string; // for signing JWT's issued by the API
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async onModuleInit() {
    this.secret = this.configService.get('JWT_SECRET') ?? 'default_secret';
  }

  async create(createDto: CreateUserDto): Promise<ServiceResult<User>> {
    const conflicting = await this.repository.findOneBy({
      email: createDto.email,
    });

    if (conflicting) {
      return { status: ServiceStatus.EmailInUse };
    }

    try {
      const repoResult = await this.repository.save(createDto);

      return {
        status: ServiceStatus.Success,
        content: repoResult,
      };
    } catch (err) {
      this.logger.error('[UsersService] create', err);
      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }

  @RequireAdmin()
  async findAll(): Promise<ServiceResult<User[]>> {
    return {
      status: ServiceStatus.Success,
      content: await this.repository.find(),
    };
  }

  async findOne(id: number): Promise<ServiceResult<User>> {
    const found = await this.repository.findOneBy({ id });

    if (!found) {
      return {
        status: ServiceStatus.NotFound,
      };
    }
    return {
      status: ServiceStatus.Success,
      content: found,
    };
  }

  async update(
    id: number,
    updateDto: UpdateUserDto,
  ): Promise<ServiceResult<User>> {
    const found = await this.findOne(id);

    if (found.status === ServiceStatus.NotFound) {
      return {
        status: ServiceStatus.NotFound,
      };
    }

    const existing = found.content as User;

    if (updateDto.email && updateDto.email !== existing.email) {
      const conflicting = await this.repository.findOneBy({
        email: updateDto.email,
      });

      if (conflicting) {
        return {
          status: ServiceStatus.EmailInUse,
        };
      }
    }

    const updated = {
      ...existing,
      ...updateDto,
    };

    try {
      const repoResult = await this.repository.save(updated);

      return {
        status: ServiceStatus.Success,
        content: repoResult,
      };
    } catch (err) {
      return { status: ServiceStatus.DatabaseError };
    }
  }

  async remove(
    currentUser: UserAuthRecord,
    id: number,
  ): Promise<ServiceResult<string>> {
    const found = await this.findOne(id);

    if (found.status === ServiceStatus.NotFound) {
      return {
        status: ServiceStatus.NotFound,
      };
    }

    const existing = found.content as User;

    if (currentUser.sub === existing.id) {
      return { status: ServiceStatus.OwnUser };
    }

    try {
      await this.repository.delete(id);

      return { status: ServiceStatus.Success };
    } catch (err) {
      this.logger.error('[UsersService] delete', err);
      return { status: ServiceStatus.DatabaseError };
    }
  }

  async login(data: UserLoginDto): Promise<ServiceResult<string>> {
    const user = await this.repository.findOneBy({ email: data.email });

    if (!user) {
      this.logger.warn(`LOGIN: no user found for email ${data.email}`);

      return {
        status: ServiceStatus.InvalidCredentials,
      };
    }

    //TODO: hash password
    if (user?.password !== data.password) {
      this.logger.warn(`LOGIN: password does not match for user ${data.email}`);

      return {
        status: ServiceStatus.InvalidCredentials,
      };
    }

    const payload: UserAuthRecord = {
      id: user.id,
      sub: user.id,
      username: user.email,
      isAdmin: user.isAdmin,
      bggUserName: user.bggUserName,
    };

    const opts = { secret: this.secret };
    const access_token = await this.jwtService.signAsync(payload, opts);

    return {
      status: ServiceStatus.Success,
      content: access_token,
    };
  }
}
