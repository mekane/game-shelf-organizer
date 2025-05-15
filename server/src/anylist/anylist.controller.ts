import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthUser, UserAuthRecord } from '@src/auth';
import { AnylistService } from './anylist.service';
import { CreateAnylistDto } from './dto/create-anylist.dto';
import { UpdateAnylistDto } from './dto/update-anylist.dto';

@Controller('anylist')
export class AnylistController {
  constructor(private readonly anylistService: AnylistService) {}

  @Post()
  create(
    @AuthUser() user: UserAuthRecord,
    @Body() createAnylistDto: CreateAnylistDto,
  ) {
    return this.anylistService.create(user, createAnylistDto);
  }

  @Get()
  findAll(@AuthUser() user: UserAuthRecord) {
    return this.anylistService.findAll(user);
  }

  @Get(':id')
  findOne(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    return this.anylistService.findOne(user, +id);
  }

  @Patch(':id')
  update(
    @AuthUser() user: UserAuthRecord,
    @Param('id') id: string,
    @Body() updateAnylistDto: UpdateAnylistDto,
  ) {
    return this.anylistService.update(user, +id, updateAnylistDto);
  }

  @Delete(':id')
  remove(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    return this.anylistService.remove(user, +id);
  }
}
