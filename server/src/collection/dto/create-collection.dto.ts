import { IsNotEmpty } from 'class-validator';
import { CollectionType } from 'src/entities';

export class CreateCollectionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: CollectionType;
}
