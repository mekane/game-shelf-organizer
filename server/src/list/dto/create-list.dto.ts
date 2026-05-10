import { ApiProperty } from '@nestjs/swagger';
import { GameId } from '@src/entities';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateListDto {
  @IsNotEmpty()
  name: string = '';

  @ApiProperty({
    description: 'Ids of games to link for inclusion in the list',
    type: () => GameId,
    isArray: true,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => GameId)
  games: GameId[] = [];
}
