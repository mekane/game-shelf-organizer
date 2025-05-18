import { AnylistColumns, AnylistOptions } from '@src/entities/Anylist.entity';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class AnylistDto {
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Type(() => AnylistOptions)
  @ValidateNested()
  options: AnylistOptions;

  @IsNotEmpty()
  @IsArray()
  @Type(() => AnylistColumns)
  @ValidateNested()
  data: AnylistColumns[];
}
