import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './Game.entity';
import { User } from './user.entity';

@Entity()
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.lists)
  user: User;

  @Column()
  name: string;

  @ManyToMany(() => Game, { cascade: true, eager: true })
  @JoinTable()
  games: Game[];
}
