import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enums
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'COORDINATOR', 'LEADER', 'MEMBER']);
export const blockStatusEnum = pgEnum('block_status', ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'REVISIT']);
export const dayStatusEnum = pgEnum('day_status', ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
export const notificationTypeEnum = pgEnum('notification_type', ['INFO', 'WARNING', 'SUCCESS', 'ERROR', 'REMINDER']);
export const configTypeEnum = pgEnum('config_type', ['STRING', 'NUMBER', 'BOOLEAN', 'JSON']);
export const reportTypeEnum = pgEnum('report_type', ['TERRITORY_PROGRESS', 'USER_ACTIVITY', 'MONTHLY_SUMMARY', 'ATTENDANCE_REPORT', 'COMPLETION_STATS']);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  name: text("name").notNull(),
  phone: varchar("phone"),
  avatar: varchar("avatar"),
  role: userRoleEnum("role").default('MEMBER').notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Territories table
export const territories = pgTable("territories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").unique().notNull(),
  mapImageUrl: varchar("map_image_url"),
  totalBlocks: integer("total_blocks").default(0).notNull(),
  completedBlocks: integer("completed_blocks").default(0).notNull(),
  completionRate: integer("completion_rate").default(0).notNull(),
  lastWorkedAt: timestamp("last_worked_at"),
  isActive: boolean("is_active").default(true).notNull(),
  description: text("description"),
  coordinates: text("coordinates"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blocks table
export const blocks = pgTable("blocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  number: text("number").notNull(),
  status: blockStatusEnum("status").default('PENDING').notNull(),
  territoryId: varchar("territory_id").notNull(),
  lastWorkedAt: timestamp("last_worked_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  unique().on(table.territoryId, table.number)
]);

// Preaching days table
export const preachingDays = pgTable("preaching_days", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").unique().notNull(),
  departureTime: varchar("departure_time").notNull(),
  meetingPlace: text("meeting_place").notNull(),
  leaderId: varchar("leader_id").notNull(),
  territoryId: varchar("territory_id"),
  status: dayStatusEnum("status").default('SCHEDULED').notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Participations table
export const participations = pgTable("participations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  preachingDayId: varchar("preaching_day_id").notNull(),
  attendedAt: timestamp("attended_at"),
  leftAt: timestamp("left_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  unique().on(table.userId, table.preachingDayId)
]);

// Work sessions table
export const workSessions = pgTable("work_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  preachingDayId: varchar("preaching_day_id").notNull(),
  blockId: varchar("block_id").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  finishedAt: timestamp("finished_at"),
  notes: text("notes"),
  housesVisited: integer("houses_visited").default(0).notNull(),
  contactsMade: integer("contacts_made").default(0).notNull(),
  materialsLeft: integer("materials_left").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").default('INFO').notNull(),
  isGlobal: boolean("is_global").default(false).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User notifications table
export const userNotifications = pgTable("user_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  notificationId: varchar("notification_id").notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  unique().on(table.userId, table.notificationId)
]);

// System config table
export const systemConfigs = pgTable("system_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  type: configTypeEnum("type").default('STRING').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Activity logs table
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: varchar("entity_id").notNull(),
  oldValues: text("old_values"),
  newValues: text("new_values"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reports table
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: reportTypeEnum("type").notNull(),
  parameters: text("parameters"),
  filePath: varchar("file_path"),
  generatedBy: varchar("generated_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  preachingDaysAsLeader: many(preachingDays),
  participations: many(participations),
  userNotifications: many(userNotifications),
}));

export const territoriesRelations = relations(territories, ({ many }) => ({
  preachingDays: many(preachingDays),
  blocks: many(blocks),
}));

export const blocksRelations = relations(blocks, ({ one, many }) => ({
  territory: one(territories, {
    fields: [blocks.territoryId],
    references: [territories.id],
  }),
  workSessions: many(workSessions),
}));

export const preachingDaysRelations = relations(preachingDays, ({ one, many }) => ({
  leader: one(users, {
    fields: [preachingDays.leaderId],
    references: [users.id],
  }),
  territory: one(territories, {
    fields: [preachingDays.territoryId],
    references: [territories.id],
  }),
  participations: many(participations),
  workSessions: many(workSessions),
}));

export const participationsRelations = relations(participations, ({ one }) => ({
  user: one(users, {
    fields: [participations.userId],
    references: [users.id],
  }),
  preachingDay: one(preachingDays, {
    fields: [participations.preachingDayId],
    references: [preachingDays.id],
  }),
}));

export const workSessionsRelations = relations(workSessions, ({ one }) => ({
  preachingDay: one(preachingDays, {
    fields: [workSessions.preachingDayId],
    references: [preachingDays.id],
  }),
  block: one(blocks, {
    fields: [workSessions.blockId],
    references: [blocks.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ many }) => ({
  userNotifications: many(userNotifications),
}));

export const userNotificationsRelations = relations(userNotifications, ({ one }) => ({
  user: one(users, {
    fields: [userNotifications.userId],
    references: [users.id],
  }),
  notification: one(notifications, {
    fields: [userNotifications.notificationId],
    references: [notifications.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTerritorySchema = createInsertSchema(territories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlockSchema = createInsertSchema(blocks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPreachingDaySchema = createInsertSchema(preachingDays).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertParticipationSchema = createInsertSchema(participations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkSessionSchema = createInsertSchema(workSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserNotificationSchema = createInsertSchema(userNotifications).omit({
  id: true,
  createdAt: true,
});

// Upsert schemas for Replit Auth
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTerritory = z.infer<typeof insertTerritorySchema>;
export type InsertBlock = z.infer<typeof insertBlockSchema>;
export type InsertPreachingDay = z.infer<typeof insertPreachingDaySchema>;
export type InsertParticipation = z.infer<typeof insertParticipationSchema>;
export type InsertWorkSession = z.infer<typeof insertWorkSessionSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertUserNotification = z.infer<typeof insertUserNotificationSchema>;

export type Territory = typeof territories.$inferSelect;
export type Block = typeof blocks.$inferSelect;
export type PreachingDay = typeof preachingDays.$inferSelect;
export type Participation = typeof participations.$inferSelect;
export type WorkSession = typeof workSessions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type UserNotification = typeof userNotifications.$inferSelect;
