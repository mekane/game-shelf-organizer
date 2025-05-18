import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
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
  async findAll(@AuthUser() user: UserAuthRecord) {
    const result = await this.anylistService.findAll(user);
    return result.content as AnylistDto[];
  }

  @Get(':id')
  async findOne(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    const result = await this.anylistService.findOne(user, +id);

    if (result.status === ServiceStatus.NotFound) {
      throw new NotFoundException();
    }

    return result.content as AnylistDto;
  }

  @Patch(':id')
  async update(
    @AuthUser() user: UserAuthRecord,
    @Param('id') id: string,
    @Body() updateAnylistDto: UpdateAnylistDto,
  ) {
    const result = await this.anylistService.update(
      user,
      +id,
      updateAnylistDto,
    );

    if (result.status === ServiceStatus.NotFound) {
      throw new NotFoundException();
    }
    if (result.status === ServiceStatus.DuplicateId) {
      throw new BadRequestException('List items must have unique ids');
    }
    if (result.status === ServiceStatus.DatabaseError) {
      throw new InternalServerErrorException();
    }

    return result.content as AnylistDto;
  }

  @Delete(':id')
  async remove(@AuthUser() user: UserAuthRecord, @Param('id') id: string) {
    const result = await this.anylistService.remove(user, +id);

    if (result.status === ServiceStatus.NotFound) {
      throw new NotFoundException();
    }

    if (result.status === ServiceStatus.DatabaseError) {
      throw new InternalServerErrorException();
    }

    return result.content;
  }
}
