import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthRecord } from '@src/auth';
import { ServiceResult, ServiceStatus } from '@src/common';
import { Repository } from 'typeorm';
import { Shelf } from '../entities';
import { forUser, idForUser } from '../util';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';

@Injectable()
export class ShelfService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(Shelf)
    private repository: Repository<Shelf>,
  ) {}

  async create(
    user: UserAuthRecord,
    createDto: CreateShelfDto,
  ): Promise<ServiceResult<Shelf>> {
    const repoResult = await this.repository.save({
      ...createDto,
      user: { id: user.id },
    });

    return {
      status: ServiceStatus.Success,
      content: repoResult,
    };
  }

  async findAll(user: UserAuthRecord): Promise<ServiceResult<Shelf[]>> {
    return {
      status: ServiceStatus.Success,
      content: await this.repository.find(forUser(user)),
    };
  }

  async findOne(
    user: UserAuthRecord,
    id: number,
  ): Promise<ServiceResult<Shelf>> {
    const found = await this.repository.findOneBy(idForUser(id, user));

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
    user: UserAuthRecord,
    id: number,
    updateDto: UpdateShelfDto,
  ): Promise<ServiceResult<Shelf>> {
    const existing = await this.findOne(user, id);

    if (!existing) {
      return {
        status: ServiceStatus.NotFound,
      };
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
      this.logger.error('[ShelfService] update', err);

      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }

  async remove(
    user: UserAuthRecord,
    id: number,
  ): Promise<ServiceResult<string>> {
    const existing = await this.findOne(user, id);

    if (!existing) {
      return {
        status: ServiceStatus.NotFound,
      };
    }

    try {
      await this.repository.delete(id);
      return {
        status: ServiceStatus.Success,
        content: 'OK',
      };
    } catch (err) {
      this.logger.error('[ShelfService] delete', err);
      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }
}
