import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '@src/entities';
import { GamesService } from './games.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [GamesService, Logger],
})
export class GamesModule {}
