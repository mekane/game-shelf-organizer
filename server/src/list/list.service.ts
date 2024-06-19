import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuthRecord } from '../auth/index';
import { List } from '../entities';
import { forUser, idForUser } from '../util';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

export enum Result {
  NOT_FOUND,
}

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private repository: Repository<List>,
  ) {}

  async create(user: UserAuthRecord, createDto: CreateListDto) {
    return this.repository.save({
      ...createDto,
      user: { id: user.sub },
    });
  }

  async findAll(user: UserAuthRecord) {
    return this.repository.find(forUser(user));
  }

  async findOne(user: UserAuthRecord, id: number) {
    const found = await this.repository.findOneBy(idForUser(id, user));

    return found ? found : Result.NOT_FOUND;
  }

  async update(user: UserAuthRecord, id: number, updateListDto: UpdateListDto) {
    const existing = await this.findOne(user, id);

    if (!existing) {
      return Result.NOT_FOUND;
    }

    const updated = {
      ...existing,
      ...updateListDto,
    };

    return this.repository.save(updated);
  }

  async remove(user: UserAuthRecord, id: number) {
    const existing = await this.findOne(user, id);

    if (!existing) {
      return Result.NOT_FOUND;
    }

    return this.repository.delete(id);
  }
}
