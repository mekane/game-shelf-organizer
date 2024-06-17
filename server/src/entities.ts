import { allCollectionEntities } from './collection';
import { allListEntities } from './list';
import { allShelfEntities } from './shelf';
import { allUserEntities } from './users';

export const allEntities = [
  ...allCollectionEntities,
  ...allListEntities,
  ...allShelfEntities,
  ...allUserEntities,
];
