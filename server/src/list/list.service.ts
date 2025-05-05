import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceResult } from '@src/common';
import { Repository } from 'typeorm';
import { UserAuthRecord } from '../auth/index';
import { List } from '../entities';
import { forUser, idForUser } from '../util';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

export interface ListResult<T> {
  result: ServiceResult;
  content?: T;
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

  async findOne(user: UserAuthRecord, id: number): Promise<ListResult<List>> {
    const found = await this.repository.findOneBy(idForUser(id, user));

    if (found) {
      return {
        result: ServiceResult.Success,
        content: found,
      };
    }

    return {
      result: ServiceResult.NotFound,
    };
  }

  async update(
    user: UserAuthRecord,
    id: number,
    updateListDto: UpdateListDto,
  ): Promise<ListResult<List>> {
    const existing = await this.findOne(user, id);

    if (!existing) {
      return {
        result: ServiceResult.NotFound,
      };
    }

    const updated = {
      ...existing,
      ...updateListDto,
    };

    try {
      const result = await this.repository.save(updated);
      return {
        result: ServiceResult.Success,
        content: result,
      };
    } catch (e) {
      return {
        result: ServiceResult.DatabaseError,
      };
    }
  }

  async remove(user: UserAuthRecord, id: number): Promise<ListResult<number>> {
    const existing = await this.findOne(user, id);

    if (!existing) {
      return {
        result: ServiceResult.NotFound,
      };
    }

    try {
      const result = await this.repository.delete(id);
      return {
        result: ServiceResult.Success,
        content: result.affected ?? 0,
      };
    } catch (e) {
      return {
        result: ServiceResult.DatabaseError,
      };
    }
  }
}
