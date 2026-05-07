import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateGameDto {
  @IsNumber()
  @Min(1)
  @Max(99)
  @IsOptional()
  customLength?: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  @IsOptional()
  customWidth?: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  @IsOptional()
  customDepth?: number;

  @IsBoolean()
  @IsOptional()
  showInCollection?: boolean;
}
