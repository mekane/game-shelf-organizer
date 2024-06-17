import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuthRecord } from '../../dist/auth/index';
import { AuthUser } from '../auth/user.decorator';
import { List } from '../entities';
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

  async create(@AuthUser() user: UserAuthRecord, createListDto: CreateListDto) {
    return this.repository.save(createListDto);
  }

  async findAll(@AuthUser() user: UserAuthRecord) {
    return this.repository.find();
  }

  async findOne(@AuthUser() user: UserAuthRecord, id: number) {
    const found = await this.repository.findOneBy({ id: +id });

    return found ? found : Result.NOT_FOUND;
  }

  async update(
    @AuthUser() user: UserAuthRecord,
    id: number,
    updateListDto: UpdateListDto,
  ) {
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

  async remove(@AuthUser() user: UserAuthRecord, id: number) {
    const existing = await this.findOne(user, id);

    if (!existing) {
      return Result.NOT_FOUND;
    }

    return this.repository.delete(id);
  }
}
