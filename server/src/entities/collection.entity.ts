import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './Game.entity';
import { User } from './User.entity';

/**
 * Represents an individual's game collection.
 * At present this is not really set up to handle multiple collections
 * for a single user since each Game record is tied to one Collection. (oneToMany)
 *
 * So the intent is that the user's single Collection reflects all the games
 * they have owned and previously owned, and then they use Lists to
 * further reduce the collection into various sub-groups. Lists use a
 * Many-to-Many relationship with Games and are more flexible.
 */
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
