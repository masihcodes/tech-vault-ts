import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';


export const userRole = pgEnum("role", ["admin", "user"]);
export const status = pgEnum("status", ["public", "private", "pending"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const libraries = pgTable("libraries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  installCommand: text("installcommand").notNull(),
  docsUrl: text("docsurl").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  isProtected: boolean("is_protected").default(false).notNull(),
  status: status("status").default("public").notNull()
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  libraryId: integer("library_id").references(() => libraries.id, { onDelete: "cascade" }).notNull(),
  personalNote: text("personalnote")
});