import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './Collection.entity';
import { List } from './list.entity';
import { Shelf } from './shelf.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  bggUserName: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    nullable: true,
    default: false,
  })
  isAdmin: boolean;

  @OneToMany(() => Collection, (collection) => collection.user)
  collections: Collection[];

  @OneToMany(() => List, (list) => list.user)
  lists: List[];

  @OneToMany(() => Shelf, (shelf) => shelf.user)
  shelves: Shelf[];
}
