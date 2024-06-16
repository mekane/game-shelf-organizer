import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionService {
  create(createCollectionDto: CreateCollectionDto) {
    return 'This action adds a new collection';
  }

  findAll() {
    return `This action returns all collection`;
  }

  findOne(id: string) {
    return `This action returns a #${id} collection`;
  }

  update(id: string, updateCollectionDto: UpdateCollectionDto) {
    return `This action updates a #${id} collection`;
  }

  remove(id: string) {
    return `This action removes a #${id} collection`;
  }
}
