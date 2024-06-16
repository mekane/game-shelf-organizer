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
    private listRepository: Repository<List>,
  ) {}

  async create(createListDto: CreateListDto) {
    return this.listRepository.save(createListDto);
  }

  async findAll() {
    return this.listRepository.find();
  }

  async findOne(id: string) {
    const found = await this.listRepository.findOneBy({ id: +id });

    return found ? found : Result.NOT_FOUND;
  }

  async update(id: string, updateListDto: UpdateListDto) {
    const existingList = await this.findOne(id);

    if (!existingList) {
      return Result.NOT_FOUND;
    }

    const updated = {
      ...existingList,
      ...updateListDto,
    };

    return this.listRepository.save(updated);
  }

  async remove(id: string) {
    const existingList = await this.findOne(id);

    if (!existingList) {
      return Result.NOT_FOUND;
    }

    return this.listRepository.delete(id);
  }
}
