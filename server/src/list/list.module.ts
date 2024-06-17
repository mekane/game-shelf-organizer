import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allListEntities } from '../entities';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  imports: [TypeOrmModule.forFeature(allListEntities)],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
