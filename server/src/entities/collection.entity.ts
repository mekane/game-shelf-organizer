import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum CollectionType {
  Owned = 'Owned',
  PreviouslyOwned = 'Previously Owned',
  WishList = 'Wish List',
  Played = 'Played',
  Other = 'Other',
  Custom = 'Custom',
}

@Entity()
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.collections)
  user: User;

  @Column()
  name: string;

  @Column()
  type: CollectionType;
}
