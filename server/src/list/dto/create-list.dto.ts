import { Game } from '@src/entities';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateListDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @Type(() => Game)
  games: Partial<Game>[];
}
