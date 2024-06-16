import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities';

export enum Result {
  NOT_FOUND,
}

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private repository: Repository<Collection>,
  ) {}

  async create(createCollectionDto: CreateCollectionDto) {
    return this.repository.save(createCollectionDto);
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: string) {
    const found = await this.repository.findOneBy({ id: +id });

    return found ? found : Result.NOT_FOUND;
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    const existing = await this.findOne(id);

    if (!existing) {
      return Result.NOT_FOUND;
    }

    const updated = {
      ...existing,
      ...updateCollectionDto,
    };

    return this.repository.save(updated);
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    if (!existing) {
      return Result.NOT_FOUND;
    }

    return this.repository.delete(id);
  }
}
