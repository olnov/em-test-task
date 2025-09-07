import type { User as DbUser, NewUser as DbNewUser } from '@db/schema';

export type UserRole = 'admin' | 'user';

export type User = DbUser;
export type NewUser = DbNewUser;

export type UserWithoutPassword = Omit<User, 'password'>;
