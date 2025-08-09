var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activityLogs: () => activityLogs,
  blockStatusEnum: () => blockStatusEnum,
  blocks: () => blocks,
  blocksRelations: () => blocksRelations,
  configTypeEnum: () => configTypeEnum,
  dayStatusEnum: () => dayStatusEnum,
  insertBlockSchema: () => insertBlockSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertParticipationSchema: () => insertParticipationSchema,
  insertPreachingDaySchema: () => insertPreachingDaySchema,
  insertTerritorySchema: () => insertTerritorySchema,
  insertUserNotificationSchema: () => insertUserNotificationSchema,
  insertUserSchema: () => insertUserSchema,
  insertWorkSessionSchema: () => insertWorkSessionSchema,
  notificationTypeEnum: () => notificationTypeEnum,
  notifications: () => notifications,
  notificationsRelations: () => notificationsRelations,
  participations: () => participations,
  participationsRelations: () => participationsRelations,
  preachingDays: () => preachingDays,
  preachingDaysRelations: () => preachingDaysRelations,
  reportTypeEnum: () => reportTypeEnum,
  reports: () => reports,
  sessions: () => sessions,
  systemConfigs: () => systemConfigs,
  territories: () => territories,
  territoriesRelations: () => territoriesRelations,
  upsertUserSchema: () => upsertUserSchema,
  userNotifications: () => userNotifications,
  userNotificationsRelations: () => userNotificationsRelations,
  userRoleEnum: () => userRoleEnum,
  users: () => users,
  usersRelations: () => usersRelations,
  workSessions: () => workSessions,
  workSessionsRelations: () => workSessionsRelations
});
import { sql, relations } from "drizzle-orm";
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
  unique
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var userRoleEnum = pgEnum("user_role", ["ADMIN", "COORDINATOR", "LEADER", "MEMBER"]);
var blockStatusEnum = pgEnum("block_status", ["PENDING", "IN_PROGRESS", "COMPLETED", "REVISIT"]);
var dayStatusEnum = pgEnum("day_status", ["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);
var notificationTypeEnum = pgEnum("notification_type", ["INFO", "WARNING", "SUCCESS", "ERROR", "REMINDER"]);
var configTypeEnum = pgEnum("config_type", ["STRING", "NUMBER", "BOOLEAN", "JSON"]);
var reportTypeEnum = pgEnum("report_type", ["TERRITORY_PROGRESS", "USER_ACTIVITY", "MONTHLY_SUMMARY", "ATTENDANCE_REPORT", "COMPLETION_STATS"]);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  name: text("name").notNull(),
  phone: varchar("phone"),
  avatar: varchar("avatar"),
  role: userRoleEnum("role").default("MEMBER").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var territories = pgTable("territories", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var blocks = pgTable("blocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  number: text("number").notNull(),
  status: blockStatusEnum("status").default("PENDING").notNull(),
  territoryId: varchar("territory_id").notNull(),
  lastWorkedAt: timestamp("last_worked_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => [
  unique().on(table.territoryId, table.number)
]);
var preachingDays = pgTable("preaching_days", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").unique().notNull(),
  departureTime: varchar("departure_time").notNull(),
  meetingPlace: text("meeting_place").notNull(),
  leaderId: varchar("leader_id").notNull(),
  territoryId: varchar("territory_id"),
  status: dayStatusEnum("status").default("SCHEDULED").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var participations = pgTable("participations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  preachingDayId: varchar("preaching_day_id").notNull(),
  attendedAt: timestamp("attended_at"),
  leftAt: timestamp("left_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => [
  unique().on(table.userId, table.preachingDayId)
]);
var workSessions = pgTable("work_sessions", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").default("INFO").notNull(),
  isGlobal: boolean("is_global").default(false).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var userNotifications = pgTable("user_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  notificationId: varchar("notification_id").notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => [
  unique().on(table.userId, table.notificationId)
]);
var systemConfigs = pgTable("system_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  type: configTypeEnum("type").default("STRING").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: varchar("entity_id").notNull(),
  oldValues: text("old_values"),
  newValues: text("new_values"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: reportTypeEnum("type").notNull(),
  parameters: text("parameters"),
  filePath: varchar("file_path"),
  generatedBy: varchar("generated_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at")
});
var usersRelations = relations(users, ({ many }) => ({
  preachingDaysAsLeader: many(preachingDays),
  participations: many(participations),
  userNotifications: many(userNotifications)
}));
var territoriesRelations = relations(territories, ({ many }) => ({
  preachingDays: many(preachingDays),
  blocks: many(blocks)
}));
var blocksRelations = relations(blocks, ({ one, many }) => ({
  territory: one(territories, {
    fields: [blocks.territoryId],
    references: [territories.id]
  }),
  workSessions: many(workSessions)
}));
var preachingDaysRelations = relations(preachingDays, ({ one, many }) => ({
  leader: one(users, {
    fields: [preachingDays.leaderId],
    references: [users.id]
  }),
  territory: one(territories, {
    fields: [preachingDays.territoryId],
    references: [territories.id]
  }),
  participations: many(participations),
  workSessions: many(workSessions)
}));
var participationsRelations = relations(participations, ({ one }) => ({
  user: one(users, {
    fields: [participations.userId],
    references: [users.id]
  }),
  preachingDay: one(preachingDays, {
    fields: [participations.preachingDayId],
    references: [preachingDays.id]
  })
}));
var workSessionsRelations = relations(workSessions, ({ one }) => ({
  preachingDay: one(preachingDays, {
    fields: [workSessions.preachingDayId],
    references: [preachingDays.id]
  }),
  block: one(blocks, {
    fields: [workSessions.blockId],
    references: [blocks.id]
  })
}));
var notificationsRelations = relations(notifications, ({ many }) => ({
  userNotifications: many(userNotifications)
}));
var userNotificationsRelations = relations(userNotifications, ({ one }) => ({
  user: one(users, {
    fields: [userNotifications.userId],
    references: [users.id]
  }),
  notification: one(notifications, {
    fields: [userNotifications.notificationId],
    references: [notifications.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTerritorySchema = createInsertSchema(territories).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBlockSchema = createInsertSchema(blocks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPreachingDaySchema = createInsertSchema(preachingDays).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertParticipationSchema = createInsertSchema(participations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertWorkSessionSchema = createInsertSchema(workSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserNotificationSchema = createInsertSchema(userNotifications).omit({
  id: true,
  createdAt: true
});
var upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, desc, asc, gte, lte, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations (mandatory for Replit Auth)
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values({
      ...userData,
      name: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.email || "Usu\xE1rio"
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        name: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.email || "Usu\xE1rio",
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async createUser(userData) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  // Territory operations
  async getTerritories() {
    return await db.select().from(territories).where(eq(territories.isActive, true)).orderBy(asc(territories.name));
  }
  async getTerritory(id) {
    const [territory] = await db.select().from(territories).where(eq(territories.id, id));
    return territory;
  }
  async createTerritory(territoryData) {
    const [territory] = await db.insert(territories).values(territoryData).returning();
    return territory;
  }
  async updateTerritory(id, territoryData) {
    const [territory] = await db.update(territories).set({ ...territoryData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(territories.id, id)).returning();
    return territory;
  }
  async deleteTerritory(id) {
    await db.update(territories).set({ isActive: false, updatedAt: /* @__PURE__ */ new Date() }).where(eq(territories.id, id));
  }
  // Block operations
  async getBlocks(territoryId) {
    return await db.select().from(blocks).where(eq(blocks.territoryId, territoryId)).orderBy(asc(blocks.number));
  }
  async getBlock(id) {
    const [block] = await db.select().from(blocks).where(eq(blocks.id, id));
    return block;
  }
  async createBlock(blockData) {
    const [block] = await db.insert(blocks).values(blockData).returning();
    return block;
  }
  async updateBlock(id, blockData) {
    const [block] = await db.update(blocks).set({ ...blockData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(blocks.id, id)).returning();
    return block;
  }
  // Preaching day operations
  async getPreachingDays(startDate, endDate) {
    let query = db.select().from(preachingDays);
    if (startDate && endDate) {
      query = query.where(
        and(
          gte(preachingDays.date, startDate),
          lte(preachingDays.date, endDate)
        )
      );
    }
    return await query.orderBy(asc(preachingDays.date));
  }
  async getPreachingDay(id) {
    const [day] = await db.select().from(preachingDays).where(eq(preachingDays.id, id));
    return day;
  }
  async getPreachingDayByDate(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const [day] = await db.select().from(preachingDays).where(
      and(
        gte(preachingDays.date, startOfDay),
        lte(preachingDays.date, endOfDay)
      )
    );
    return day;
  }
  async createPreachingDay(dayData) {
    const [day] = await db.insert(preachingDays).values(dayData).returning();
    return day;
  }
  async updatePreachingDay(id, dayData) {
    const [day] = await db.update(preachingDays).set({ ...dayData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(preachingDays.id, id)).returning();
    return day;
  }
  async deletePreachingDay(id) {
    await db.delete(preachingDays).where(eq(preachingDays.id, id));
  }
  // Participation operations
  async getParticipations(preachingDayId) {
    return await db.select().from(participations).where(eq(participations.preachingDayId, preachingDayId)).orderBy(desc(participations.createdAt));
  }
  async getUserParticipations(userId) {
    return await db.select().from(participations).where(eq(participations.userId, userId)).orderBy(desc(participations.createdAt));
  }
  async createParticipation(participationData) {
    const [participation] = await db.insert(participations).values(participationData).returning();
    return participation;
  }
  async updateParticipation(id, participationData) {
    const [participation] = await db.update(participations).set({ ...participationData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(participations.id, id)).returning();
    return participation;
  }
  async deleteParticipation(id) {
    await db.delete(participations).where(eq(participations.id, id));
  }
  // Work session operations
  async getWorkSessions(preachingDayId, blockId) {
    let query = db.select().from(workSessions);
    if (preachingDayId && blockId) {
      query = query.where(
        and(
          eq(workSessions.preachingDayId, preachingDayId),
          eq(workSessions.blockId, blockId)
        )
      );
    } else if (preachingDayId) {
      query = query.where(eq(workSessions.preachingDayId, preachingDayId));
    } else if (blockId) {
      query = query.where(eq(workSessions.blockId, blockId));
    }
    return await query.orderBy(desc(workSessions.startedAt));
  }
  async createWorkSession(sessionData) {
    const [session2] = await db.insert(workSessions).values(sessionData).returning();
    return session2;
  }
  async updateWorkSession(id, sessionData) {
    const [session2] = await db.update(workSessions).set({ ...sessionData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workSessions.id, id)).returning();
    return session2;
  }
  // Notification operations
  async getNotifications(userId) {
    if (userId) {
      return await db.select({
        id: notifications.id,
        title: notifications.title,
        message: notifications.message,
        type: notifications.type,
        isGlobal: notifications.isGlobal,
        expiresAt: notifications.expiresAt,
        createdAt: notifications.createdAt,
        updatedAt: notifications.updatedAt
      }).from(notifications).leftJoin(
        userNotifications,
        and(
          eq(userNotifications.notificationId, notifications.id),
          eq(userNotifications.userId, userId)
        )
      ).where(
        and(
          sql2`(${notifications.expiresAt} IS NULL OR ${notifications.expiresAt} > NOW())`,
          sql2`(${notifications.isGlobal} = true OR ${userNotifications.userId} = ${userId})`
        )
      ).orderBy(desc(notifications.createdAt));
    }
    return await db.select().from(notifications).where(
      and(
        eq(notifications.isGlobal, true),
        sql2`(${notifications.expiresAt} IS NULL OR ${notifications.expiresAt} > NOW())`
      )
    ).orderBy(desc(notifications.createdAt));
  }
  async getUserNotifications(userId) {
    return await db.select().from(userNotifications).where(eq(userNotifications.userId, userId)).orderBy(desc(userNotifications.createdAt));
  }
  async createNotification(notificationData) {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }
  async createUserNotification(userNotificationData) {
    const [userNotification] = await db.insert(userNotifications).values(userNotificationData).returning();
    return userNotification;
  }
  async markNotificationAsRead(userId, notificationId) {
    await db.update(userNotifications).set({ readAt: /* @__PURE__ */ new Date() }).where(
      and(
        eq(userNotifications.userId, userId),
        eq(userNotifications.notificationId, notificationId)
      )
    );
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/territories", isAuthenticated, async (req, res) => {
    try {
      const territories2 = await storage.getTerritories();
      res.json(territories2);
    } catch (error) {
      console.error("Error fetching territories:", error);
      res.status(500).json({ message: "Failed to fetch territories" });
    }
  });
  app2.get("/api/territories/:id", isAuthenticated, async (req, res) => {
    try {
      const territory = await storage.getTerritory(req.params.id);
      if (!territory) {
        return res.status(404).json({ message: "Territory not found" });
      }
      res.json(territory);
    } catch (error) {
      console.error("Error fetching territory:", error);
      res.status(500).json({ message: "Failed to fetch territory" });
    }
  });
  app2.post("/api/territories", isAuthenticated, async (req, res) => {
    try {
      const data = insertTerritorySchema.parse(req.body);
      const territory = await storage.createTerritory(data);
      res.status(201).json(territory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating territory:", error);
      res.status(500).json({ message: "Failed to create territory" });
    }
  });
  app2.put("/api/territories/:id", isAuthenticated, async (req, res) => {
    try {
      const data = insertTerritorySchema.partial().parse(req.body);
      const territory = await storage.updateTerritory(req.params.id, data);
      res.json(territory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating territory:", error);
      res.status(500).json({ message: "Failed to update territory" });
    }
  });
  app2.delete("/api/territories/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteTerritory(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting territory:", error);
      res.status(500).json({ message: "Failed to delete territory" });
    }
  });
  app2.get("/api/territories/:territoryId/blocks", isAuthenticated, async (req, res) => {
    try {
      const blocks2 = await storage.getBlocks(req.params.territoryId);
      res.json(blocks2);
    } catch (error) {
      console.error("Error fetching blocks:", error);
      res.status(500).json({ message: "Failed to fetch blocks" });
    }
  });
  app2.post("/api/blocks", isAuthenticated, async (req, res) => {
    try {
      const data = insertBlockSchema.parse(req.body);
      const block = await storage.createBlock(data);
      res.status(201).json(block);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating block:", error);
      res.status(500).json({ message: "Failed to create block" });
    }
  });
  app2.put("/api/blocks/:id", isAuthenticated, async (req, res) => {
    try {
      const data = insertBlockSchema.partial().parse(req.body);
      const block = await storage.updateBlock(req.params.id, data);
      res.json(block);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating block:", error);
      res.status(500).json({ message: "Failed to update block" });
    }
  });
  app2.get("/api/preaching-days", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate) : void 0;
      const end = endDate ? new Date(endDate) : void 0;
      const days = await storage.getPreachingDays(start, end);
      res.json(days);
    } catch (error) {
      console.error("Error fetching preaching days:", error);
      res.status(500).json({ message: "Failed to fetch preaching days" });
    }
  });
  app2.get("/api/preaching-days/today", isAuthenticated, async (req, res) => {
    try {
      const today = /* @__PURE__ */ new Date();
      const day = await storage.getPreachingDayByDate(today);
      res.json(day || null);
    } catch (error) {
      console.error("Error fetching today's preaching day:", error);
      res.status(500).json({ message: "Failed to fetch today's preaching day" });
    }
  });
  app2.get("/api/preaching-days/:id", isAuthenticated, async (req, res) => {
    try {
      const day = await storage.getPreachingDay(req.params.id);
      if (!day) {
        return res.status(404).json({ message: "Preaching day not found" });
      }
      res.json(day);
    } catch (error) {
      console.error("Error fetching preaching day:", error);
      res.status(500).json({ message: "Failed to fetch preaching day" });
    }
  });
  app2.post("/api/preaching-days", isAuthenticated, async (req, res) => {
    try {
      const data = insertPreachingDaySchema.parse(req.body);
      const day = await storage.createPreachingDay(data);
      res.status(201).json(day);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating preaching day:", error);
      res.status(500).json({ message: "Failed to create preaching day" });
    }
  });
  app2.put("/api/preaching-days/:id", isAuthenticated, async (req, res) => {
    try {
      const data = insertPreachingDaySchema.partial().parse(req.body);
      const day = await storage.updatePreachingDay(req.params.id, data);
      res.json(day);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating preaching day:", error);
      res.status(500).json({ message: "Failed to update preaching day" });
    }
  });
  app2.delete("/api/preaching-days/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deletePreachingDay(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting preaching day:", error);
      res.status(500).json({ message: "Failed to delete preaching day" });
    }
  });
  app2.get("/api/preaching-days/:id/participations", isAuthenticated, async (req, res) => {
    try {
      const participations2 = await storage.getParticipations(req.params.id);
      res.json(participations2);
    } catch (error) {
      console.error("Error fetching participations:", error);
      res.status(500).json({ message: "Failed to fetch participations" });
    }
  });
  app2.get("/api/users/:userId/participations", isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.userId;
      if (userId !== req.user.claims.sub) {
        const currentUser = await storage.getUser(req.user.claims.sub);
        if (!currentUser || currentUser.role !== "ADMIN") {
          return res.status(403).json({ message: "Forbidden" });
        }
      }
      const participations2 = await storage.getUserParticipations(userId);
      res.json(participations2);
    } catch (error) {
      console.error("Error fetching user participations:", error);
      res.status(500).json({ message: "Failed to fetch user participations" });
    }
  });
  app2.post("/api/participations", isAuthenticated, async (req, res) => {
    try {
      const data = insertParticipationSchema.parse(req.body);
      if (data.userId !== req.user.claims.sub) {
        const currentUser = await storage.getUser(req.user.claims.sub);
        if (!currentUser || !["ADMIN", "COORDINATOR", "LEADER"].includes(currentUser.role)) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }
      const participation = await storage.createParticipation(data);
      res.status(201).json(participation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating participation:", error);
      res.status(500).json({ message: "Failed to create participation" });
    }
  });
  app2.put("/api/participations/:id", isAuthenticated, async (req, res) => {
    try {
      const data = insertParticipationSchema.partial().parse(req.body);
      const participation = await storage.updateParticipation(req.params.id, data);
      res.json(participation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating participation:", error);
      res.status(500).json({ message: "Failed to update participation" });
    }
  });
  app2.delete("/api/participations/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteParticipation(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting participation:", error);
      res.status(500).json({ message: "Failed to delete participation" });
    }
  });
  app2.get("/api/work-sessions", isAuthenticated, async (req, res) => {
    try {
      const { preachingDayId, blockId } = req.query;
      const sessions2 = await storage.getWorkSessions(
        preachingDayId,
        blockId
      );
      res.json(sessions2);
    } catch (error) {
      console.error("Error fetching work sessions:", error);
      res.status(500).json({ message: "Failed to fetch work sessions" });
    }
  });
  app2.post("/api/work-sessions", isAuthenticated, async (req, res) => {
    try {
      const data = insertWorkSessionSchema.parse(req.body);
      const session2 = await storage.createWorkSession(data);
      res.status(201).json(session2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating work session:", error);
      res.status(500).json({ message: "Failed to create work session" });
    }
  });
  app2.put("/api/work-sessions/:id", isAuthenticated, async (req, res) => {
    try {
      const data = insertWorkSessionSchema.partial().parse(req.body);
      const session2 = await storage.updateWorkSession(req.params.id, data);
      res.json(session2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating work session:", error);
      res.status(500).json({ message: "Failed to update work session" });
    }
  });
  app2.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications2 = await storage.getNotifications(userId);
      res.json(notifications2);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app2.get("/api/users/:userId/notifications", isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.userId;
      if (userId !== req.user.claims.sub) {
        const currentUser = await storage.getUser(req.user.claims.sub);
        if (!currentUser || currentUser.role !== "ADMIN") {
          return res.status(403).json({ message: "Forbidden" });
        }
      }
      const notifications2 = await storage.getUserNotifications(userId);
      res.json(notifications2);
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      res.status(500).json({ message: "Failed to fetch user notifications" });
    }
  });
  app2.post("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser || !["ADMIN", "COORDINATOR"].includes(currentUser.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const data = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(data);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });
  app2.post("/api/user-notifications", isAuthenticated, async (req, res) => {
    try {
      const data = insertUserNotificationSchema.parse(req.body);
      const userNotification = await storage.createUserNotification(data);
      res.status(201).json(userNotification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating user notification:", error);
      res.status(500).json({ message: "Failed to create user notification" });
    }
  });
  app2.put("/api/notifications/:notificationId/read", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const notificationId = req.params.notificationId;
      await storage.markNotificationAsRead(userId, notificationId);
      res.status(204).send();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
