import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';

export const userTable = pgTable("users-table", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer().default(5)
})