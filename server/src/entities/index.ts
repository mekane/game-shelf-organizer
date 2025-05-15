import { Anylist } from './Anylist.entity';
import { Collection } from './Collection.entity';
import { Game } from './Game.entity';
import { List } from './List.entity';
import { Shelf } from './shelf.entity';
import { User } from './User.entity';

export * from './Collection.entity';
export * from './Game.entity';
export * from './List.entity';
export * from './shelf.entity';
export * from './User.entity';

export const allCollectionEntities = [Collection, Game];
export const allListEntities = [List];
export const allShelfEntities = [Shelf];
export const allUserEntities = [User];

export const allEntities = [
  ...allCollectionEntities,
  ...allListEntities,
  ...allShelfEntities,
  ...allUserEntities,
  Anylist,
];
