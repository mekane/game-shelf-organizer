import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionService } from '@src/collection/collection.service';
import { allCollectionEntities } from '@src/entities';
import { GamesService } from '@src/games/games.service';
import { BggService } from './bgg.service';

@Module({
  imports: [TypeOrmModule.forFeature(allCollectionEntities)],
  exports: [BggService],
  providers: [BggService, CollectionService, GamesService],
})
export class BggModule {}
