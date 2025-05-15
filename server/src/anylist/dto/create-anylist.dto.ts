import { AnylistOptions } from '@src/entities/Anylist.entity';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { AnylistColumns } from './../../entities/Anylist.entity';

export class CreateAnylistDto {
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
