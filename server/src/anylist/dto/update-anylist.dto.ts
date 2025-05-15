import { PartialType } from '@nestjs/mapped-types';
import { CreateAnylistDto } from './create-anylist.dto';

export class UpdateAnylistDto extends PartialType(CreateAnylistDto) {}
