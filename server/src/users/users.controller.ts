import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDto } from './dto/auth';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Result, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Should be totally open to allow logins
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const result = await this.usersService.login(userLoginDto);

    if (result === Result.INVALID_CREDENTIALS) {
      throw new UnauthorizedException();
    }
  }

  // These should all require logged-in user + admin privileges
  @Post()
  async create(@Body() createDto: CreateUserDto) {
    return this.usersService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findOne(+id);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    const result = await this.usersService.update(+id, updateDto);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.usersService.remove(+id);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }
}
