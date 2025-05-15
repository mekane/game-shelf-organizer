import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BggModule } from '@src/bgg';
import { GamesService } from '@src/games/games.service';
import { allCollectionEntities } from '../entities';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

@Module({
  imports: [TypeOrmModule.forFeature(allCollectionEntities), BggModule],
  controllers: [CollectionController],
  providers: [CollectionService, GamesService, Logger],
})
export class CollectionModule {}
