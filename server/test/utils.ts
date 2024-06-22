import { UserAuthRecord } from 'src/auth';

export function mockAuthUser({
  userId = 1,
  username = 'test@example.com',
  bggUserName = 'bgg',
  isAdmin = false,
}: {
  userId?: number;
  username?: string;
  bggUserName?: string;
  isAdmin?: boolean;
} = {}): UserAuthRecord {
  return {
    id: userId,
    sub: userId,
    username,
    isAdmin,
    bggUserName,
  };
}
