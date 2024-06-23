import { IsNotEmpty, IsOptional } from 'class-validator';
import { Game } from 'src/entities/Game.entity';

export class CreateCollectionDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  games?: Partial<Game>[];
}
