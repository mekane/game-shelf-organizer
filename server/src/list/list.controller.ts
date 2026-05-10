import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { checkServiceResults, ServiceStatus } from '@src/common';
import { UserAuthRecord } from '../auth/index';
import { AuthUser } from '../auth/user.decorator';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListService } from './list.service';

@ApiBearerAuth()
@ApiTags('List')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async create(
    @AuthUser() user: UserAuthRecord,
    @Body() createListDto: CreateListDto,
  ) {
    const result = await this.listService.create(user, createListDto);
    checkServiceResults(result);
    return result.content;
  }

  @Get()
  async findAll(@AuthUser() user: UserAuthRecord) {
    const result = await this.listService.findAll(user);
    checkServiceResults(result);
    return result.content;
  }

  @Get(':id')
  async findOne(
    @AuthUser() user: UserAuthRecord,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const ser = await this.listService.findOne(user, +id);

    if (ser.status === ServiceStatus.NotFound) {
      throw new NotFoundException();
    }

    return ser.content;
  }

  @Patch(':id')
  async update(
    @AuthUser() user: UserAuthRecord,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListDto: UpdateListDto,
  ) {
    const ser = await this.listService.update(user, +id, updateListDto);

    if (ser.status === ServiceStatus.NotFound) {
      throw new NotFoundException();
    }

    return ser.content;
  }

  @Delete(':id')
  async remove(
    @AuthUser() user: UserAuthRecord,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const ser = await this.listService.remove(user, +id);

    if (ser.status === ServiceStatus.NotFound) {
      throw new NotFoundException();
    }

    return ser.content;
  }
}
