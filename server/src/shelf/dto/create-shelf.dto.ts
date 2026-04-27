import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SizeDto {
  @IsNumber()
  width!: number;

  @IsNumber()
  height!: number;
}

export class PositionDto {
  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;
}

export class GridDto {
  @IsInt()
  rows!: number;

  @IsInt()
  columns!: number;
}

export class BorderSizeDto {
  @IsNumber()
  outer!: number;

  @IsNumber()
  inner!: number;
}

export class RoomDto {
  @IsNotEmpty()
  @Type(() => SizeDto)
  @ValidateNested()
  size!: SizeDto;
}

export class ShelfDto {
  @IsInt()
  id!: number;

  @IsOptional()
  @IsString()
  label?: string;

  @IsNotEmpty()
  @Type(() => PositionDto)
  position!: PositionDto;

  @IsNotEmpty()
  @Type(() => GridDto)
  grid!: GridDto;

  @IsNotEmpty()
  @Type(() => SizeDto)
  cellSize!: SizeDto;

  @IsOptional()
  @Type(() => BorderSizeDto)
  borders?: BorderSizeDto;
}

export class CreateShelfDto {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  @Type(() => RoomDto)
  @ValidateNested()
  room!: RoomDto;

  @IsNotEmpty()
  @IsArray()
  @Type(() => ShelfDto)
  @ValidateNested({ each: true })
  shelves!: ShelfDto[];
}
