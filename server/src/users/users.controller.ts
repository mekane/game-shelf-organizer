import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ServiceStatus } from '@src/common';
import { AuthUser, Public, RequireAdmin, UserAuthRecord } from '../auth';
import { UserLoginDto } from './dto/auth';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const result = await this.usersService.login(userLoginDto);

    if (result.status === ServiceStatus.InvalidCredentials) {
      throw new UnauthorizedException();
    }

    return result.content;
  }

  @RequireAdmin()
  @Post()
  async create(@Body() createDto: CreateUserDto) {
    const result = await this.usersService.create(createDto);

    if (result.status === ServiceStatus.EmailInUse) {
      throw new BadRequestException('That email is already in use');
    }

    return result;
  }

  @RequireAdmin()
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @RequireAdmin()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findOne(+id);

    if (result.status === ServiceStatus.NotFound) {
      throw new NotFoundException();
    }

    return result;
  }

  @RequireAdmin()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    const result = await this.usersService.update(+id, updateDto);

    if (result.status === ServiceStatus.NotFound) {
      throw new NotFoundException();
    }

    if (result.status === ServiceStatus.EmailInUse) {
      throw new BadRequestException('That email is already in use');
    }

    return result;
  }

  @RequireAdmin()
  @Delete(':id')
  async remove(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    const result = await this.usersService.remove(user, +id);

    if (result.status === ServiceStatus.NotFound) {
      throw new NotFoundException();
    }

    if (result.status === ServiceStatus.OwnUser) {
      throw new BadRequestException('You cannot delete your own user');
    }

    return result;
  }
}
