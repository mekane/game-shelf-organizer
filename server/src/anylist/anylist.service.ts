import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthRecord } from '@src/auth';
import { ServiceResult, ServiceStatus } from '@src/common';
import { Anylist } from '@src/entities/Anylist.entity';
import { forUser, idForUser } from '@src/util';
import { Repository } from 'typeorm';
import { CreateAnylistDto } from './dto/create-anylist.dto';
import { UpdateAnylistDto } from './dto/update-anylist.dto';

@Injectable()
export class AnylistService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(Anylist)
    private readonly repository: Repository<Anylist>,
  ) {}

  async create(
    user: UserAuthRecord,
    createAnylistDto: CreateAnylistDto,
  ): Promise<ServiceResult<Anylist>> {
    this.logger.log(`[AnylistService] create`, createAnylistDto);

    // Create the entity so the @BeforeInsert fires
    const newEntity = this.repository.create({
      ...createAnylistDto,
      user: { id: user.sub },
    });
    // Manually populate options and data since they're not column mapped
    newEntity.options = createAnylistDto.options;
    newEntity.data = createAnylistDto.data;

    // TODO: check for duplicate ids in the data rows, return BAD_REQUEST if found

    try {
      const repoResult = await this.repository.save(newEntity);
      return {
        status: ServiceStatus.Success,
        content: repoResult,
      };
    } catch (err) {
      this.logger.error('[AnylistService] create', err);
      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }

  async findAll(user: UserAuthRecord): Promise<ServiceResult<Anylist[]>> {
    return {
      status: ServiceStatus.Success,
      content: await this.repository.find(forUser(user)),
    };
  }

  async findOne(
    user: UserAuthRecord,
    id: number,
  ): Promise<ServiceResult<Anylist>> {
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
    updateAnylistDto: UpdateAnylistDto,
  ): Promise<ServiceResult<Anylist>> {
    const { content: existing } = await this.findOne(user, id);

    if (!existing) {
      return {
        status: ServiceStatus.NotFound,
      };
    }

    // TODO: check for duplicate ids in the data rows, return BAD_REQUEST if found

    this.logger.log(`[AnylistService] update`, updateAnylistDto);

    const updated = {
      ...(existing as Anylist),
      ...updateAnylistDto,
    };

    try {
      const repoResult = await this.repository.save(updated);

      return {
        status: ServiceStatus.Success,
        content: repoResult,
      };
    } catch (err) {
      this.logger.error('[AnylistService] update', err);
      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }

  async remove(
    user: UserAuthRecord,
    id: number,
  ): Promise<ServiceResult<string>> {
    const find = await this.findOne(user, id);

    if (find.status === ServiceStatus.NotFound) {
      return { status: ServiceStatus.NotFound };
    }

    const existing = find.content as Anylist;

    this.logger.log(`[AnylistService] delete anylist ${existing?.id}`);

    try {
      await this.repository.remove(existing);

      return {
        status: ServiceStatus.Success,
        content: 'OK',
      };
    } catch (err) {
      this.logger.error('[AnylistService] delete', err);
      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }
}
