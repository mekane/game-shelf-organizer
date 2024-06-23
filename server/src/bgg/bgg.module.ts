import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allCollectionEntities } from 'src/entities';
import { CollectionService } from '../collection/collection.service';
import { BggController } from './bgg.controller';
import { BggService } from './bgg.service';

@Module({
  imports: [TypeOrmModule.forFeature(allCollectionEntities)],
  controllers: [BggController],
  providers: [BggService, CollectionService],
})
export class BggModule {}
