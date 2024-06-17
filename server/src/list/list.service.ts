import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from './entities';

export enum Result {
  NOT_FOUND,
}

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private repository: Repository<List>,
  ) {}

  async create(createListDto: CreateListDto) {
    return this.repository.save(createListDto);
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const found = await this.repository.findOneBy({ id: +id });

    return found ? found : Result.NOT_FOUND;
  }

  async update(id: number, updateListDto: UpdateListDto) {
    const existing = await this.findOne(id);

    if (!existing) {
      return Result.NOT_FOUND;
    }

    const updated = {
      ...existing,
      ...updateListDto,
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
