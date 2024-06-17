import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allShelfEntities } from '../entities';
import { ShelfController } from './shelf.controller';
import { ShelfService } from './shelf.service';

@Module({
  imports: [TypeOrmModule.forFeature(allShelfEntities)],
  controllers: [ShelfController],
  providers: [ShelfService],
})
export class ShelfModule {}
