import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ServiceStatus } from '@src/common';
import { UserAuthRecord } from '../auth/index';
import { AuthUser } from '../auth/user.decorator';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';
import { ShelfService } from './shelf.service';

@Controller('shelf')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Post()
  async create(
    @AuthUser() user: UserAuthRecord,
    @Body() createShelfDto: CreateShelfDto,
  ) {
    return this.shelfService.create(user, createShelfDto);
  }

  @Get()
  async findAll(@AuthUser() user: UserAuthRecord) {
    return this.shelfService.findAll(user);
  }

  @Get(':id')
  async findOne(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    const result = await this.shelfService.findOne(user, +id);

    if (result.status === ServiceStatus.NotFound) {
      throw new NotFoundException();
    }

    return result;
  }

  @Patch(':id')
  async update(
    @AuthUser() user: UserAuthRecord,
    @Param('id') id: string,
    @Body() updateShelfDto: UpdateShelfDto,
  ) {
    const result = await this.shelfService.update(user, +id, updateShelfDto);

    if (result.status === ServiceStatus.NotFound) {
      throw new NotFoundException();
    }

    return result;
  }

  @Delete(':id')
  async remove(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    const result = await this.shelfService.remove(user, +id);

    if (result.status === ServiceStatus.NotFound) {
      throw new NotFoundException();
    }

    return result;
  }
}
