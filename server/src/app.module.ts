import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'reflect-metadata';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { CollectionModule } from './collection/collection.module';
import { sqlLiteOptions } from './data.source';
import { ListModule } from './list/list.module';
import { ShelfModule } from './shelf/shelf.module';
import { UsersModule } from './users/users.module';
import { BggService } from './bgg/bgg.service';

@Module({
  imports: [
    CollectionModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ListModule,
    ShelfModule,
    TypeOrmModule.forRoot(sqlLiteOptions),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
    JwtService,
    BggService,
  ],
})
export class AppModule {}
