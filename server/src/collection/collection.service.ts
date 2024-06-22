import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuthRecord } from '../auth/index';
import { Collection, CollectionType } from '../entities';
import { forUser, idForUser } from '../util';
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
   * Get the standard four collection types for organizing a BGG list
   */
  async getStandardSet(user: UserAuthRecord) {
    const collectionsForUser = await this.findAll(user);
    const owned = collectionsForUser.find(
      (c) => c.type === CollectionType.Owned,
    );
    const previous = collectionsForUser.find(
      (c) => c.type === CollectionType.PreviouslyOwned,
    );
    const wishList = collectionsForUser.find(
      (c) => c.type === CollectionType.WishList,
    );
    const played = collectionsForUser.find(
      (c) => c.type === CollectionType.Played,
    );

    return {
      [CollectionType.Owned]: owned,
      [CollectionType.PreviouslyOwned]: previous,
      [CollectionType.WishList]: wishList,
      [CollectionType.Played]: played,
    };
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
