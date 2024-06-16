import { Injectable } from '@nestjs/common';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { GetShelfDto } from './dto/get-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';

@Injectable()
export class ShelfService {
  create(createShelfDto: CreateShelfDto) {
    console.log(`create shelf `, createShelfDto);
    return 'This action adds a new shelf';
  }

  findAll(): GetShelfDto[] {
    return [];
  }

  findOne(id: string): GetShelfDto {
    console.log(`find shelf by id(${id})`);
    return {
      id: 'test',
      name: 'test',
      width: 2,
      height: 4,
      rows: 4,
      columns: 2,
    };
  }

  update(id: string, updateShelfDto: UpdateShelfDto) {
    console.log(`update shelf ${id}`, updateShelfDto);

    return `This action updates a #${id} shelf`;
  }

  remove(id: string) {
    return `This action removes a #${id} shelf`;
  }
}
