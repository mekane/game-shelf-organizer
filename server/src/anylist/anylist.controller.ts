import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, UserAuthRecord } from '@src/auth';
import { ServiceStatus } from '@src/common';
import { AnylistService } from './anylist.service';
import { AnylistDto } from './dto';
import { CreateAnylistDto } from './dto/create-anylist.dto';
import { UpdateAnylistDto } from './dto/update-anylist.dto';

@ApiBearerAuth()
@ApiTags('Anylist')
@Controller('anylist')
export class AnylistController {
  constructor(private readonly anylistService: AnylistService) {}

  @Post()
  async create(
    @AuthUser() user: UserAuthRecord,
    @Body() createAnylistDto: CreateAnylistDto,
  ): Promise<AnylistDto> {
    const result = await this.anylistService.create(user, createAnylistDto);

    if (result.status === ServiceStatus.DuplicateId) {
      throw new BadRequestException('List items must have unique ids');
    }

    return result.content as AnylistDto;
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
