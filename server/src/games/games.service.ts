import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthRecord } from '@src/auth';
import { ServiceResult, ServiceStatus } from '@src/common';
import { Game } from '@src/entities';
import { Repository } from 'typeorm';
import { UpdateGameDto } from './dto/game.update.dto';

@Injectable()
export class GamesService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(Game)
    private readonly repository: Repository<Game>,
  ) {
    this.logger = new Logger(GamesService.name);
  }

  async findOne(
    bggId: number,
    versionId: number,
    user: UserAuthRecord,
  ): Promise<ServiceResult<Game>> {
    const existing = await this.repository.findOneBy({
      bggId,
      versionId,
      userId: user.id,
    });

    if (!existing) {
      return {
        status: ServiceStatus.NotFound,
      };
    }

    return {
      status: ServiceStatus.Success,
      content: existing,
    };
  }

  async updateById(
    bggId: number,
    versionId: number,
    user: UserAuthRecord,
    update: UpdateGameDto,
  ): Promise<ServiceResult<Game>> {
    const existing = await this.repository.findOneBy({
      bggId,
      versionId,
      userId: user.id,
    });

    if (!existing) {
      return {
        status: ServiceStatus.NotFound,
      };
    }

    if (update.customDepth) {
      existing.customDepth = update.customDepth;
    }

    if (update.customLength) {
      existing.customLength = update.customLength;
    }

    if (update.customWidth) {
      existing.customWidth = update.customWidth;
    }

    if (update.showInCollection) {
      existing.showInCollection = update.showInCollection;
    }

    try {
      await this.repository.save(existing);

      return {
        status: ServiceStatus.Success,
      };
    } catch (err) {
      this.logger.error('error updating', err);

      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }

  async remove(games: Game | Game[]) {
    if (Array.isArray(games)) {
      this.repository.remove(games);
    } else {
      this.repository.remove([games]);
    }
  }

  async removeById(
    bggId: number,
    versionId: number,
    user: UserAuthRecord,
  ): Promise<ServiceResult<number>> {
    const existing = await this.repository.findOneBy({
      bggId,
      versionId,
      userId: user.id,
    });

    if (!existing) {
      return {
        status: ServiceStatus.NotFound,
      };
    }

    try {
      await this.repository.remove(existing);

      return {
        status: ServiceStatus.Success,
        content: 1,
      };
    } catch (err) {
      this.logger.error('error deleting', err);

      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }
}
