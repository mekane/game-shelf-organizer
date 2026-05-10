import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from '@src/games/games.module';
import { allListEntities, Game } from '../entities';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  imports: [GamesModule, TypeOrmModule.forFeature([...allListEntities, Game])],
  controllers: [ListController],
  providers: [ListService, Logger],
})
export class ListModule {}
