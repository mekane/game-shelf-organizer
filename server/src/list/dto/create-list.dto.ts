import { IsNotEmpty } from 'class-validator';

export class CreateListDto {
  @IsNotEmpty()
  name: string;
}
