import { UserAuthRecord } from './auth';

export function forUser(user: UserAuthRecord) {
  return { where: { user: { id: user.id } } };
}

export function idForUser(entityId: number, user: UserAuthRecord) {
  return {
    id: entityId,
    user: { id: user.id }, //implicit AND
  };
}
