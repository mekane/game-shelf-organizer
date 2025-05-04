import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Collection } from './Collection.entity';

/**
 * Represents one instance of a game owned by one user
 * Primary key is composed of:
 * userId + bggId + versionId
 *
 * So the same game owned by two different users are distinct records, and two
 * different versions of the same game owned by the same user are also distinct
 * records.
 *
 * There are actually only a few properties that are unique to the owner (these
 * are noted at the bottom of the entity) so those could be moved to a join table
 * and then the "Game" table could be normalized and act like a cache of BGG reference
 * data.
 */
@Entity()
export class Game {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  bggId: number;

  @PrimaryColumn()
  versionId: number;

  @Column()
  name: string;

  @Column({ type: String, nullable: true })
  versionName: string | null;

  @ManyToOne(() => Collection, (collection) => collection.games)
  collection: Collection;

  @Column({ type: Number, nullable: true })
  yearPublished: number | null;

  @Column({ type: Number, nullable: true })
  bggRank: number | null;

  @Column({ type: Number, nullable: true })
  bggRating: number | null;

  @Column({ type: String, nullable: true })
  imageUrl: string | null;

  @Column({ type: String, nullable: true })
  thumbnailUrl: string | null;

  @Column({ type: Number, nullable: true })
  length: number | null;

  @Column({ type: Number, nullable: true })
  width: number | null;

  @Column({ type: Number, nullable: true })
  depth: number | null;

  /*===== These properties are specific to the user that owns it =====*/
  @Column({ default: false })
  owned: boolean;

  @Column({ default: false })
  previouslyOwned: boolean;

  @Column({ default: 0 })
  plays: number;

  @Column({ default: 0 })
  rating: number;
}
