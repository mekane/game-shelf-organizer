import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthRecord } from '@src/auth';
import { Game } from '@src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class GamesService {
  constructor(
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

  async removeById(bggId: number, versionId: number, user: UserAuthRecord) {
    const existing = await this.repository.findOneBy({
      bggId,
      versionId,
      userId: user.id,
    });

    if (!existing) {
      return 'not found'; //replace with ServiceResult
    }

    return this.repository.remove(existing);
  }
}
