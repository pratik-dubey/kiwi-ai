import { pgTable, serial, varchar, integer, date, json, text } from 'drizzle-orm/pg-core';

export const userTable = pgTable("users-table", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer().default(5)
})

export const ProjectTable = pgTable("project", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    projectId: varchar().notNull().unique(),
    userInput: varchar(),
    device: varchar(),
    projectName: varchar(),
    theme: varchar(),
    createdOn: date().defaultNow(),
    config: json(),
    projectVisualDescription: text(),
    userId: varchar().references(() => userTable.email).notNull()
})

export const ScreenConfigTable = pgTable("screenConfig", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    projectId: varchar().references(() => ProjectTable.projectId).notNull(),
    screenId: varchar(),
    screenName: varchar(),
    purpose: varchar(),
    screenDescription: varchar(),
    code: text()
})