import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BggService } from 'src/bgg/bgg.service';
import { allCollectionEntities } from '../entities';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

@Module({
  imports: [TypeOrmModule.forFeature(allCollectionEntities)],
  controllers: [CollectionController],
  providers: [CollectionService, BggService],
})
export class CollectionModule {}
