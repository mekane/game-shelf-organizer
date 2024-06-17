import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  bggUserName: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  isAdmin?: boolean;
}
