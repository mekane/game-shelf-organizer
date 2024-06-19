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
import { UserAuthRecord } from '../auth/index';
import { AuthUser } from '../auth/user.decorator';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListService, Result } from './list.service';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async create(
    @AuthUser() user: UserAuthRecord,
    @Body() createListDto: CreateListDto,
  ) {
    return this.listService.create(user, createListDto);
  }

  @Get()
  async findAll(@AuthUser() user: UserAuthRecord) {
    return this.listService.findAll(user);
  }

  @Get(':id')
  async findOne(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    const result = await this.listService.findOne(user, +id);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }

  @Patch(':id')
  async update(
    @AuthUser() user: UserAuthRecord,
    @Param('id') id: string,
    @Body() updateListDto: UpdateListDto,
  ) {
    const result = await this.listService.update(user, +id, updateListDto);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }

  @Delete(':id')
  async remove(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    const result = await this.listService.remove(user, +id);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }
}
