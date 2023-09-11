import {
  binary,
  index,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const clients = mysqlTable(
  "clients",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    secret: varchar("secret", {
      length: 255,
    }).notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => {
    return {
      createdAt: index("created_at_idx").on(table.createdAt),
      updatedAt: index("updated_at_idx").on(table.updatedAt),
    };
  }
);
