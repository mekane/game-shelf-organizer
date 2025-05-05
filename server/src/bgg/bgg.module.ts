import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allCollectionEntities } from '@src/entities';
import { BggService } from './bgg.service';

@Module({
  imports: [TypeOrmModule.forFeature(allCollectionEntities)],
  exports: [BggService],
  providers: [BggService],
})
export class BggModule {}
