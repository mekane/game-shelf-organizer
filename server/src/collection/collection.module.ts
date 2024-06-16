import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { allCollectionEntities } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature(allCollectionEntities)],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
