import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuthRecord } from '../auth/index';
import { Collection } from '../entities';
import { forUser, idForUser } from '../util';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';

export enum Result {
  NOT_FOUND,
}

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private repository: Repository<Collection>,
  ) {}

  async create(user: UserAuthRecord, createDto: CreateCollectionDto) {
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

  /**
   * Returns the default collection for the user.
   * Creates one if it doesn't exist
   * @param user
   */
  async defaultCollection(user: UserAuthRecord) {
    const userCollections = await this.findAll(user);

    if (!userCollections || !userCollections.length) {
      const collection = await this.create(user, { name: 'Default' });
      return collection;
    }

    return userCollections[0];
  }

  async update(
    user: UserAuthRecord,
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

    console.log(
      `[CollectionService] update collection ${updated.id}: ${updated.games.length} games`,
    );

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
