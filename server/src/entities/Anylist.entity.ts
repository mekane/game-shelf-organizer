import { Exclude } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';

export class AnylistColumns {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsInt()
  rating: number;

  @IsString()
  notes: string;

  @IsString()
  thumbnail: string; // url
}

export class AnylistOptions {
  @IsNotEmpty()
  hide: Record<keyof AnylistColumns, boolean>;

  @IsNotEmpty()
  ratingMax: number; // default 5
}

@Entity()
export class Anylist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.anylists)
  user: User;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  optionsSerialized: string;

  options: AnylistOptions;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  dataSerialized: string;

  data: AnylistColumns[];

  @AfterLoad()
  deserializeJson() {
    //console.log(`<<< Deserialize Anylist`, this.optionsSerialized);
    this.options = JSON.parse(this.optionsSerialized ?? '{}');
    this.data = JSON.parse(this.dataSerialized ?? '[]');
  }

  @BeforeInsert()
  serializeJson() {
    //console.log(`>>> Serialize Anylist`, this.options);
    this.optionsSerialized = JSON.stringify(this.options);
    this.dataSerialized = JSON.stringify(this.data);
  }
}
