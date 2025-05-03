import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Collection } from './Collection.entity';

@Entity()
export class Game {
  @PrimaryColumn()
  bggId: number;

  @PrimaryColumn()
  versionId: number;

  @ManyToOne(() => Collection, (collection) => collection.games)
  collection: Collection;

  @Column()
  name: string;

  @Column({ type: Number, nullable: true })
  yearPublished: number | null;

  @Column({ type: Number, nullable: true })
  bggRank: number | null;

  @Column({ type: Number, nullable: true })
  bggRating: number | null;

  @Column({ default: 0 })
  plays: number;

  @Column({ default: 0 })
  rating: number;

  @Column({ type: String, nullable: true })
  imageUrl: string | null;

  @Column({ type: String, nullable: true })
  thumbnailUrl: string | null;

  @Column({ type: String, nullable: true })
  versionName: string | null;

  @Column({ type: Number, nullable: true })
  length: number | null;

  @Column({ type: Number, nullable: true })
  width: number;

  @Column({ type: Number, nullable: true })
  depth: number;

  @Column({ default: false })
  owned: boolean;

  @Column({ default: false })
  previouslyOwned: boolean;
}
