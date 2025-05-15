import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allShelfEntities } from '../entities';
import { ShelfController } from './shelf.controller';
import { ShelfService } from './shelf.service';

@Module({
  imports: [TypeOrmModule.forFeature(allShelfEntities)],
  controllers: [ShelfController],
  providers: [Logger, ShelfService],
})
export class ShelfModule {}
