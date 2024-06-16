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
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListService, Result } from './list.service';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  @Get()
  async findAll() {
    return this.listService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.listService.findOne(id);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    const result = await this.listService.update(id, updateListDto);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.listService.remove(id);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }
}
