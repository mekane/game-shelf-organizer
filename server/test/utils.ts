import { UserAuthRecord } from 'src/auth';

export function mockAuthUser({
  userId = 1,
  username = 'test@example.com',
  isAdmin = false,
}: {
  userId?: number;
  username?: string;
  isAdmin?: boolean;
} = {}): UserAuthRecord {
  return {
    sub: userId,
    username,
    isAdmin,
  };
}
