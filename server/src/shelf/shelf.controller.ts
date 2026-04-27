import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { checkServiceResults } from '@src/common';
import { UserAuthRecord } from '../auth/index';
import { AuthUser } from '../auth/user.decorator';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';
import { ShelfService } from './shelf.service';

@ApiBearerAuth()
@ApiTags('Shelf')
@Controller('shelf')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Post()
  async create(
    @AuthUser() user: UserAuthRecord,
    @Body() createShelfDto: CreateShelfDto,
  ) {
    const result = await this.shelfService.create(user, createShelfDto);

    checkServiceResults(result);

    return result.content?.id;
  }

  @Get()
  async findAll(@AuthUser() user: UserAuthRecord) {
    const result = await this.shelfService.findAll(user);

    checkServiceResults(result);

    return result.content;
  }

  @Get(':id')
  async findOne(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    const result = await this.shelfService.findOne(user, +id);

    checkServiceResults(result);

    return result.content;
  }

  @Patch(':id')
  async update(
    @AuthUser() user: UserAuthRecord,
    @Param('id') id: string,
    @Body() updateShelfDto: UpdateShelfDto,
  ) {
    const result = await this.shelfService.update(user, +id, updateShelfDto);

    checkServiceResults(result);
  }

  @Delete(':id')
  async remove(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    const result = await this.shelfService.remove(user, +id);

    checkServiceResults(result);
  }
}
