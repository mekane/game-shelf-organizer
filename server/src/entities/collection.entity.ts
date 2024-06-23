import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './Game.entity';
import { User } from './user.entity';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.collections)
  user: User;

  @Column()
  name: string;

  @OneToMany(() => Game, (game) => game.collection, {
    cascade: true,
    eager: true,
  })
  games: Game[];
}
