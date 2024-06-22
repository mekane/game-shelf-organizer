import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allCollectionEntities } from 'src/entities';
import { BggController } from './bgg.controller';
import { BggService } from './bgg.service';

@Module({
  imports: [TypeOrmModule.forFeature(allCollectionEntities)],
  controllers: [BggController],
  providers: [BggService],
})
export class BggModule {}
