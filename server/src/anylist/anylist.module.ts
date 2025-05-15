import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anylist } from '@src/entities/Anylist.entity';
import { AnylistController } from './anylist.controller';
import { AnylistService } from './anylist.service';

@Module({
  imports: [TypeOrmModule.forFeature([Anylist])],
  controllers: [AnylistController],
  providers: [AnylistService, Logger],
})
export class AnylistModule {}
