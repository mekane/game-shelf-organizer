import { Exclude } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './Game.entity';
import { User } from './User.entity';

export class ListColumnConfig {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  field!: string;

  @IsString()
  @IsNotEmpty()
  header!: string;

  @IsInt()
  width?: number;
}

@Entity()
export class List {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.lists)
  user!: User;

  @Column()
  name: string = '';

  @ManyToMany(() => Game, { cascade: true, eager: true })
  @JoinTable()
  games!: Game[];

  @Column({ type: 'text', nullable: true })
  @Exclude()
  configSerialized?: string;

  config!: ListColumnConfig[];

  @AfterLoad()
  deserializeJson() {
    this.config = JSON.parse(this.configSerialized ?? '{}');
  }

  @BeforeInsert()
  @BeforeUpdate()
  serializeJson() {
    this.configSerialized = JSON.stringify(this.config);
  }
}
