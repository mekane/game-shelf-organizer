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
  private readonly logger: Logger;

  constructor(
    @InjectRepository(Shelf)
    private repository: Repository<Shelf>,
  ) {
    this.logger = new Logger(ShelfService.name);
  }

  async create(
    user: UserAuthRecord,
    createDto: CreateShelfDto,
  ): Promise<ServiceResult<Shelf>> {
    const createObj = {
      ...createDto,
      user: { id: user.id },
    };

    const newEntity = this.repository.create(createObj);
    newEntity.room = createDto.room;
    newEntity.shelves = createDto.shelves;

    try {
      const repoResult = await this.repository.save(newEntity);

      return {
        status: ServiceStatus.Success,
        content: repoResult,
      };
    } catch (err) {
      this.logger.error('[ShelfService] create', err);
      return {
        status: ServiceStatus.DatabaseError,
      };
    }
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

    delete found.roomSerialized;
    delete found.shelvesSerialized;

    return {
      status: ServiceStatus.Success,
      content: found,
    };
  }

  async update(
    user: UserAuthRecord,
    id: number,
    updateDto: UpdateShelfDto,
  ): Promise<ServiceResult<void>> {
    const { content: existing } = await this.findOne(user, id);

    if (!existing) {
      return {
        status: ServiceStatus.NotFound,
      };
    }

    const updated: UpdateShelfDto = {
      ...existing,
      ...updateDto,
    };

    console.log('updated', updated);

    try {
      await this.repository.save(updated);

      return {
        status: ServiceStatus.Success,
      };
    } catch (err) {
      this.logger.error('[ShelfService] update', err);

      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }

  async remove(user: UserAuthRecord, id: number): Promise<ServiceResult<void>> {
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
      };
    } catch (err) {
      this.logger.error('[ShelfService] delete', err);
      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }
}
