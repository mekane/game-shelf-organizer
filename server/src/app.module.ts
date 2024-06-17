import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'reflect-metadata';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectionModule } from './collection/collection.module';
import { sqlLiteOptions } from './data.source';
import { ListModule } from './list/list.module';
import { ShelfModule } from './shelf/shelf.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CollectionModule,
    ListModule,
    ShelfModule,
    TypeOrmModule.forRoot(sqlLiteOptions),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
