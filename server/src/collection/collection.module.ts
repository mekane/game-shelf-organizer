import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allCollectionEntities } from '../entities';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

@Module({
  imports: [TypeOrmModule.forFeature(allCollectionEntities)],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
