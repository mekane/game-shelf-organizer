import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'reflect-metadata';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectionModule } from './collection/collection.module';
import { allEntities } from './entities';
import { ListModule } from './list/list.module';
import { ShelfModule } from './shelf/shelf.module';

const opts: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: allEntities,
  migrations: [],
  subscribers: [],
};

@Module({
  imports: [
    ShelfModule,
    ListModule,
    CollectionModule,
    TypeOrmModule.forRoot(opts),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
