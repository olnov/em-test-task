import { 
    pgTable, 
    varchar, 
    uuid, 
    timestamp, 
    date, 
    boolean,
    pgEnum,
    index,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin','user']);

export const usersTable = pgTable("users", {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  middleName: varchar('middle_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  dateOfBirth: date('date_of_birth'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  userRole: userRoleEnum('user_role').default('user').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
    index('users_last_name_idx').on(table.lastName),
    index('users_email_idx').on(table.email),
    index('users_user_role_idx').on(table.userRole),
]);

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;