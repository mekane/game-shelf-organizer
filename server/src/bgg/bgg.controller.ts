import { Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthUser, UserAuthRecord } from '../auth';
import { BggService } from './bgg.service';
import { BggDataFetchResult } from './types';

@Controller('bgg')
export class BggController {
  constructor(private readonly bggService: BggService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/sync')
  async sync(@Res() response: Response, @AuthUser() user: UserAuthRecord) {
    const result = await this.bggService.syncCollections(user);

    if ((result as BggDataFetchResult).status >= 400) {
      const error = result as BggDataFetchResult;
      response.status(error.status).send(error.message);
      return;
    }

    response.status(200).send(result);
    return result;
  }
}
