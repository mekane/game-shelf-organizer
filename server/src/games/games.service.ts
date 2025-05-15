import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthRecord } from '@src/auth';
import { ServiceResult, ServiceStatus } from '@src/common';
import { Game } from '@src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class GamesService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(Game)
    private readonly repository: Repository<Game>,
  ) {}

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
      this.logger.error('[GamesService] delete', err);

      return {
        status: ServiceStatus.DatabaseError,
      };
    }
  }
}
