import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';
import { Shelf } from './entities';

export enum Result {
  NOT_FOUND,
}

@Injectable()
export class ShelfService {
  constructor(
    @InjectRepository(Shelf)
    private repository: Repository<Shelf>,
  ) {}

  async create(createDto: CreateShelfDto) {
    return this.repository.save(createDto);
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const found = await this.repository.findOneBy({ id });

    return found ? found : Result.NOT_FOUND;
  }

  async update(id: number, updateDto: UpdateShelfDto) {
    const existing = await this.findOne(id);

    if (!existing) {
      return Result.NOT_FOUND;
    }

    const updated = {
      ...existing,
      ...updateDto,
    };

    return this.repository.save(updated);
  }

  async remove(id: number) {
    const existing = await this.findOne(id);

    if (!existing) {
      return Result.NOT_FOUND;
    }

    return this.repository.delete(id);
  }
}
