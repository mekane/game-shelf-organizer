import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthRecord } from 'src/auth';
import { Repository } from 'typeorm';
import { UserLoginDto } from './dto/auth';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export enum Result {
  EMAIL_IN_USE,
  INVALID_CREDENTIALS,
  NOT_FOUND,
  OWN_USER,
}

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(createDto: CreateUserDto) {
    const conflicting = await this.repository.findOneBy({
      email: createDto.email,
    });

    if (conflicting) {
      return Result.EMAIL_IN_USE;
    }

    return this.repository.save(createDto);
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const found = await this.repository.findOneBy({ id });

    return found ? found : Result.NOT_FOUND;
  }

  async update(id: number, updateDto: UpdateUserDto) {
    const existing = await this.findOne(id);

    if (!existing || existing === Result.NOT_FOUND) {
      return Result.NOT_FOUND;
    }

    if (updateDto.email && updateDto.email !== existing.email) {
      const conflicting = await this.repository.findOneBy({
        email: updateDto.email,
      });

      if (conflicting) {
        return Result.EMAIL_IN_USE;
      }
    }

    const updated = {
      ...existing,
      ...updateDto,
    };

    return this.repository.save(updated);
  }

  async remove(currentUser: UserAuthRecord, id: number) {
    const existing = await this.findOne(id);

    if (!existing || existing === Result.NOT_FOUND) {
      return Result.NOT_FOUND;
    }

    if (currentUser.sub === existing.id) {
      return Result.OWN_USER;
    }

    return this.repository.delete(id);
  }

  async login(data: UserLoginDto) {
    const user = await this.repository.findOneBy({ email: data.email });

    if (!user) {
      return Result.INVALID_CREDENTIALS;
    }

    console.log('got user', user);

    //TODO: hash password
    if (user?.password !== data.password) {
      return Result.INVALID_CREDENTIALS;
    }

    const payload: UserAuthRecord = {
      sub: user.id,
      username: user.email,
      isAdmin: user.isAdmin,
    };
    const key = this.configService.get('JWT_SECRET');
    const opts = { secret: key };
    const access_token = await this.jwtService.signAsync(payload, opts);

    return {
      access_token,
    };
  }
}
