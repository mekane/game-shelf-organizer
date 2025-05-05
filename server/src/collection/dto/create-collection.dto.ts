import { Game } from '@src/entities';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  games?: Partial<Game>[];
}
