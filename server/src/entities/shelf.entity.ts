import { RoomDto, ShelfDto } from '@src/shelf/dto';
import { Exclude } from 'class-transformer';
import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity()
export class Shelf {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.shelves)
  user!: User;

  @Column()
  name: string = '';

  @Column({ type: 'text', nullable: true })
  @Exclude()
  roomSerialized?: string;

  room!: RoomDto;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  shelvesSerialized?: string;

  shelves!: ShelfDto[];

  @AfterLoad()
  deserializeJson() {
    // console.log(`<<< Deserialize Shelf: room`, this.roomSerialized);
    // console.log(`<<< Deserialize Shelf: shelves`, this.shelvesSerialized);
    this.room = JSON.parse(this.roomSerialized ?? '{}');
    this.shelves = JSON.parse(this.shelvesSerialized ?? '[]');
  }

  @BeforeInsert()
  serializeJson() {
    // console.log(`>>> Serialize Shelf: room`, this.room);
    // console.log(`>>> Serialize Shelf: shelves`, this.shelves);
    this.roomSerialized = JSON.stringify(this.room);
    this.shelvesSerialized = JSON.stringify(this.shelves);
  }
}
