import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'reflect-metadata';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { BggModule } from './bgg';
import { CollectionModule } from './collection/collection.module';
import { sqlLiteOptions } from './data.source';
import { ListModule } from './list/list.module';
import { ShelfModule } from './shelf/shelf.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    BggModule,
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
  ],
})
export class AppModule {}
