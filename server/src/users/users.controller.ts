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
import { AuthUser, UserAuthRecord } from 'src/auth';
import { Public } from 'src/auth/public.decorator';
import { RequireAdmin } from 'src/auth/requireAdmin.decorator';
import { UserLoginDto } from './dto/auth';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Result, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const result = await this.usersService.login(userLoginDto);

    if (result === Result.INVALID_CREDENTIALS) {
      throw new UnauthorizedException();
    }

    return result;
  }

  @RequireAdmin()
  @Post()
  async create(@Body() createDto: CreateUserDto) {
    const result = await this.usersService.create(createDto);

    if (result === Result.EMAIL_IN_USE) {
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

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }

  @RequireAdmin()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    const result = await this.usersService.update(+id, updateDto);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    if (result === Result.EMAIL_IN_USE) {
      throw new BadRequestException('That email is already in use');
    }

    return result;
  }

  @RequireAdmin()
  @Delete(':id')
  async remove(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    const result = await this.usersService.remove(+id);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    if (user.sub === +id) {
      throw new BadRequestException('You cannot delete your own user');
    }

    return result;
  }
}
