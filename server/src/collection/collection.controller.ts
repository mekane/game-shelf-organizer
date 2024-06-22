import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserAuthRecord } from '../auth/index';
import { AuthUser } from '../auth/user.decorator';
import { CollectionService, Result } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  async create(
    @AuthUser() user: UserAuthRecord,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    return this.collectionService.create(user, createCollectionDto);
  }

  @Get()
  async findAll(@AuthUser() user: UserAuthRecord) {
    return this.collectionService.findAll(user);
  }

  @Get(':id')
  async findOne(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    const result = await this.collectionService.findOne(user, +id);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }

  @Patch(':id')
  async update(
    @AuthUser() user: UserAuthRecord,
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    const result = await this.collectionService.update(
      user,
      +id,
      updateCollectionDto,
    );

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }

  @Delete(':id')
  async remove(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    const result = await this.collectionService.remove(user, +id);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }
}
