import { UserAuthRecord } from '@src/auth';
export declare function mockAuthUser({ userId, username, bggUserName, isAdmin, }?: {
    userId?: number;
    username?: string;
    bggUserName?: string;
    isAdmin?: boolean;
}): UserAuthRecord;
