export * from './auth.guard';
export * from './public.decorator';
export * from './requireAdmin.decorator';
export * from './user.decorator';

// This is encoded into the JWT that the user returns in their auth header
export interface UserAuthRecord {
  id: number; // user.id
  sub: number; // user.id
  username: string; // user.email
  bggUserName: string; // user.bggUsername
  isAdmin: boolean; // user.isAdmin
}
