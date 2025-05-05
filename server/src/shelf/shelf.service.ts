import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthRecord } from '@src/auth';
import { Repository } from 'typeorm';
import { Shelf } from '../entities';
import { forUser, idForUser } from '../util';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';

export enum Result {
  NOT_FOUND,
}

@Injectable()
export class ShelfService {
  constructor(
    @InjectRepository(Shelf)
    private repository: Repository<Shelf>,
  ) {}

  async create(user: UserAuthRecord, createDto: CreateShelfDto) {
    return this.repository.save({
      ...createDto,
      user: { id: user.id },
    });
  }

  async findAll(user: UserAuthRecord) {
    return this.repository.find(forUser(user));
  }

  async findOne(user: UserAuthRecord, id: number) {
    const found = await this.repository.findOneBy(idForUser(id, user));

    return found ? found : Result.NOT_FOUND;
  }

  async update(user: UserAuthRecord, id: number, updateDto: UpdateShelfDto) {
    const existing = await this.findOne(user, id);

    if (!existing) {
      return Result.NOT_FOUND;
    }

    const updated = {
      ...existing,
      ...updateDto,
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
