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
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';
import { Result, ShelfService } from './shelf.service';

@Controller('shelf')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Post()
  async create(@Body() createShelfDto: CreateShelfDto) {
    return this.shelfService.create(createShelfDto);
  }

  @Get()
  async findAll() {
    return this.shelfService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.shelfService.findOne(+id);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShelfDto: UpdateShelfDto,
  ) {
    const result = await this.shelfService.update(+id, updateShelfDto);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.shelfService.remove(+id);

    if (result === Result.NOT_FOUND) {
      throw new NotFoundException();
    }

    return result;
  }
}
