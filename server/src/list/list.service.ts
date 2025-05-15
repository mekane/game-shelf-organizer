import { Injectable, Logger } from '@nestjs/common';
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
    private readonly logger: Logger,
    @InjectRepository(List)
    private repository: Repository<List>,
  ) {}

  async create(
    user: UserAuthRecord,
    createDto: CreateListDto,
  ): Promise<ServiceResult<List>> {
    this.logger.log('[ListService] create', createDto);

    try {
      const repoResult = await this.repository.save({
        ...createDto,
        user: { id: user.sub },
      });

      return {
        status: ServiceStatus.Success,
        content: repoResult,
      };
    } catch (err) {
      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }

  async findAll(user: UserAuthRecord): Promise<ServiceResult<List[]>> {
    return {
      status: ServiceStatus.Success,
      content: await this.repository.find(forUser(user)),
    };
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
    const found = await this.findOne(user, id);

    if (found.status !== ServiceStatus.Success) {
      return {
        status: ServiceStatus.NotFound,
      };
    }

    const updated = {
      ...found.content,
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
