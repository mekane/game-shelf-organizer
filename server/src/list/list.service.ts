import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceStatus } from '@src/common';
import { ServiceResult } from '@src/common/ServiceResult';
import { Repository } from 'typeorm';
import { UserAuthRecord } from '../auth/index';
import { List } from '../entities';
import { forUser, idForUser } from '../util';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

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

  async findOne(
    user: UserAuthRecord,
    id: number,
  ): Promise<ServiceResult<List>> {
    const found = await this.repository.findOneBy(idForUser(id, user));

    if (found) {
      return {
        status: ServiceStatus.Success,
        content: found,
      };
    }

    return {
      status: ServiceStatus.NotFound,
    };
  }

  async update(
    user: UserAuthRecord,
    id: number,
    updateListDto: UpdateListDto,
  ): Promise<ServiceResult<List>> {
    const existing = await this.findOne(user, id);

    if (!existing) {
      return {
        status: ServiceStatus.NotFound,
      };
    }

    const updated = {
      ...existing,
      ...updateListDto,
    };

    try {
      const result = await this.repository.save(updated);
      return {
        status: ServiceStatus.Success,
        content: result,
      };
    } catch (e) {
      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }

  async remove(
    user: UserAuthRecord,
    id: number,
  ): Promise<ServiceResult<number>> {
    const existing = await this.findOne(user, id);

    if (!existing) {
      return {
        status: ServiceStatus.NotFound,
      };
    }

    try {
      const result = await this.repository.delete(id);
      return {
        status: ServiceStatus.Success,
        content: result.affected ?? 0,
      };
    } catch (e) {
      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }
}
