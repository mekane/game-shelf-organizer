import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuthRecord } from '../../dist/auth/index';
import { AuthUser } from '../auth/user.decorator';
import { Collection } from '../entities';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

export enum Result {
  NOT_FOUND,
}

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private repository: Repository<Collection>,
  ) {}

  async create(
    @AuthUser() user: UserAuthRecord,
    createCollectionDto: CreateCollectionDto,
  ) {
    return this.repository.save(createCollectionDto);
  }

  async findAll(@AuthUser() user: UserAuthRecord) {
    return this.repository.find();
  }

  async findOne(@AuthUser() user: UserAuthRecord, id: number) {
    const found = await this.repository.findOneBy({ id });

    return found ? found : Result.NOT_FOUND;
  }

  async update(
    @AuthUser() user: UserAuthRecord,
    id: number,
    updateCollectionDto: UpdateCollectionDto,
  ) {
    const existing = await this.findOne(user, id);

    if (!existing) {
      return Result.NOT_FOUND;
    }

    const updated = {
      ...existing,
      ...updateCollectionDto,
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
