import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [Logger, UsersService],
})
export class UsersModule {}
