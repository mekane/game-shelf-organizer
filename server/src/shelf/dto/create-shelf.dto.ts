import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateShelfDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  width?: number;

  @IsOptional()
  height?: number;

  @IsOptional()
  rows?: number;

  @IsOptional()
  columns?: number;
}
