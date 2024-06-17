import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLoginDto } from './dto/auth';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export enum Result {
  NOT_FOUND,
  INVALID_CREDENTIALS,
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(createDto: CreateUserDto) {
    return this.repository.save(createDto);
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const found = await this.repository.findOneBy({ id: +id });

    return found ? found : Result.NOT_FOUND;
  }

  async update(id: number, updateDto: UpdateUserDto) {
    const existing = await this.findOne(id);

    if (!existing) {
      return Result.NOT_FOUND;
    }

    const updated = {
      ...existing,
      ...updateDto,
    };

    return this.repository.save(updated);
  }

  async remove(id: number) {
    const existing = await this.findOne(id);

    if (!existing) {
      return Result.NOT_FOUND;
    }

    return this.repository.delete(id);
  }

  async login(data: UserLoginDto) {
    const user = await this.repository.findOneBy({ email: data.email });

    if (!user) {
      return Result.INVALID_CREDENTIALS;
    }

    console.log('got user', user);

    //TODO: check password

    return user;
  }
}
