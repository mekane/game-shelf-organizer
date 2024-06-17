export * from './auth.guard';
export * from './public.decorator';
export * from './user.decorator';

// This is encoded into the JWT that the user returns in their auth header
export interface UserAuthRecord {
  sub: number; // user.id
  username: string; // user.email
  isAdmin: boolean; // user.isAdmin
}
