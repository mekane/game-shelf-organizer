import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { GetShelfDto } from './dto/get-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';
import { ShelfService } from './shelf.service';

@Controller('shelf')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Post()
  create(@Body() createShelfDto: CreateShelfDto) {
    return this.shelfService.create(createShelfDto);
  }

  @Get()
  findAll() {
    return this.shelfService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): GetShelfDto {
    return this.shelfService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShelfDto: UpdateShelfDto) {
    return this.shelfService.update(id, updateShelfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shelfService.remove(id);
  }
}
