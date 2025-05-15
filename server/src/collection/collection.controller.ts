import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { BggService } from '@src/bgg';
import { ServiceStatus } from '@src/common';
import { AuthUser, UserAuthRecord } from '../auth';
import { CollectionService } from './collection.service';

@Controller('collection')
export class CollectionController {
  constructor(
    private readonly bggService: BggService,
    private readonly collectionService: CollectionService,
  ) {}

  @Get()
  async get(@AuthUser() user: UserAuthRecord) {
    return await this.collectionService.defaultCollection(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/sync')
  async sync(@AuthUser() user: UserAuthRecord) {
    const result = await this.bggService.syncCollections(user);

    if (result.result !== ServiceStatus.Success) {
      throw new BadRequestException(result.message);
    }

    return result.content;
  }
}
