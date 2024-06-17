import { Collection } from './collection.entity';
import { List } from './list.entity';
import { Shelf } from './shelf.entity';
import { User } from './user.entity';

export * from './collection.entity';
export * from './list.entity';
export * from './shelf.entity';
export * from './user.entity';

export const allCollectionEntities = [Collection];
export const allListEntities = [List];
export const allShelfEntities = [Shelf];
export const allUserEntities = [User];

export const allEntities = [
  ...allCollectionEntities,
  ...allListEntities,
  ...allShelfEntities,
  ...allUserEntities,
];
