import { pgTable, text, timestamp, boolean, index, integer } from "drizzle-orm/pg-core"

// User table (Better Auth)
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  name: text("name"),
  username: text("username").unique(),
  image: text("image"),
  bio: text("bio"),
  website: text("website"),
  github: text("github"),
  x: text("x"),
  telegram: text("telegram"),
  role: text("role").notNull().default("user"), // "user" | "admin"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("user_username_idx").on(table.username),
])

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}, (table) => [index("session_userId_idx").on(table.userId)])

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [index("account_userId_idx").on(table.userId)])

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [index("verification_identifier_idx").on(table.identifier)])

// Designs table
export const design = pgTable("design", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug"),
  description: text("description"),
  category: text("category").notNull(),
  content: text("content").notNull(), // The skill/prompt content (main SKILL.md)
  demoUrl: text("demo_url"),
  thumbnailUrl: text("thumbnail_url"),
  // Status: draft, pending, approved, rejected
  status: text("status").notNull().default("draft"),
  reviewMessage: text("review_message"), // Admin feedback message
  viewCount: integer("view_count").notNull().default(0),
  files: text("files"), // JSON array of additional files [{path, content, type}]
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("design_userId_idx").on(table.userId),
  index("design_category_idx").on(table.category),
  index("design_status_idx").on(table.status),
  index("design_slug_idx").on(table.slug),
  index("design_userId_slug_idx").on(table.userId, table.slug),
  index("design_createdAt_idx").on(table.createdAt),
  index("design_approved_createdAt_idx").on(table.status, table.createdAt), // For public feed
])

// Bookmarks table
export const bookmark = pgTable("bookmark", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  designId: text("design_id")
    .notNull()
    .references(() => design.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("bookmark_userId_idx").on(table.userId),
  index("bookmark_designId_idx").on(table.designId),
  index("bookmark_user_design_idx").on(table.userId, table.designId),
])

// Design views table - for tracking unique views with deduplication
export const designView = pgTable("design_view", {
  id: text("id").primaryKey(),
  designId: text("design_id")
    .notNull()
    .references(() => design.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" }), // null for anonymous
  ipHash: text("ip_hash"), // hash of IP for anonymous tracking
  viewedAt: timestamp("viewed_at").notNull().defaultNow(),
}, (table) => [
  index("designView_designId_idx").on(table.designId),
  index("designView_userId_idx").on(table.userId),
  index("designView_design_user_idx").on(table.designId, table.userId),
  index("designView_design_ip_idx").on(table.designId, table.ipHash),
  index("designView_viewedAt_idx").on(table.viewedAt),
])

// Stars table - similar to GitHub stars
export const star = pgTable("star", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  designId: text("design_id")
    .notNull()
    .references(() => design.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("star_userId_idx").on(table.userId),
  index("star_designId_idx").on(table.designId),
  index("star_user_design_idx").on(table.userId, table.designId),
])

