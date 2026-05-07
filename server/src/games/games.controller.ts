import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { checkServiceResults } from '@src/common';
import { UserAuthRecord } from '../auth/index';
import { AuthUser } from '../auth/user.decorator';
import { UpdateGameDto } from './dto';
import { GamesService } from './games.service';

@ApiBearerAuth()
@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get(':bggId/:versionId')
  async findOne(
    @AuthUser() user: UserAuthRecord,
    @Param('bggId', ParseIntPipe) bggId: number,
    @Param('versionId', ParseIntPipe) versionId: number,
  ) {
    const result = await this.gamesService.findOne(bggId, versionId, user);

    checkServiceResults(result);

    return result.content;
  }

  @Patch(':bggId/:versionId')
  async update(
    @AuthUser() user: UserAuthRecord,
    @Param('bggId', ParseIntPipe) bggId: number,
    @Param('versionId', ParseIntPipe) versionId: number,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    const result = await this.gamesService.updateById(
      bggId,
      versionId,
      user,
      updateGameDto,
    );

    checkServiceResults(result);
  }
}
