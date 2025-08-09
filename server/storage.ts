import {
  users,
  territories,
  blocks,
  preachingDays,
  participations,
  workSessions,
  notifications,
  userNotifications,
  type User,
  type UpsertUser,
  type InsertUser,
  type Territory,
  type InsertTerritory,
  type Block,
  type InsertBlock,
  type PreachingDay,
  type InsertPreachingDay,
  type Participation,
  type InsertParticipation,
  type WorkSession,
  type InsertWorkSession,
  type Notification,
  type InsertNotification,
  type UserNotification,
  type InsertUserNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, gte, lte, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: InsertUser): Promise<User>;
  
  // Territory operations
  getTerritories(): Promise<Territory[]>;
  getTerritory(id: string): Promise<Territory | undefined>;
  createTerritory(territory: InsertTerritory): Promise<Territory>;
  updateTerritory(id: string, territory: Partial<InsertTerritory>): Promise<Territory>;
  deleteTerritory(id: string): Promise<void>;
  
  // Block operations
  getBlocks(territoryId: string): Promise<Block[]>;
  getBlock(id: string): Promise<Block | undefined>;
  createBlock(block: InsertBlock): Promise<Block>;
  updateBlock(id: string, block: Partial<InsertBlock>): Promise<Block>;
  
  // Preaching day operations
  getPreachingDays(startDate?: Date, endDate?: Date): Promise<PreachingDay[]>;
  getPreachingDay(id: string): Promise<PreachingDay | undefined>;
  getPreachingDayByDate(date: Date): Promise<PreachingDay | undefined>;
  createPreachingDay(day: InsertPreachingDay): Promise<PreachingDay>;
  updatePreachingDay(id: string, day: Partial<InsertPreachingDay>): Promise<PreachingDay>;
  deletePreachingDay(id: string): Promise<void>;
  
  // Participation operations
  getParticipations(preachingDayId: string): Promise<Participation[]>;
  getUserParticipations(userId: string): Promise<Participation[]>;
  createParticipation(participation: InsertParticipation): Promise<Participation>;
  updateParticipation(id: string, participation: Partial<InsertParticipation>): Promise<Participation>;
  deleteParticipation(id: string): Promise<void>;
  
  // Work session operations
  getWorkSessions(preachingDayId?: string, blockId?: string): Promise<WorkSession[]>;
  createWorkSession(session: InsertWorkSession): Promise<WorkSession>;
  updateWorkSession(id: string, session: Partial<InsertWorkSession>): Promise<WorkSession>;
  
  // Notification operations
  getNotifications(userId?: string): Promise<Notification[]>;
  getUserNotifications(userId: string): Promise<UserNotification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  createUserNotification(userNotification: InsertUserNotification): Promise<UserNotification>;
  markNotificationAsRead(userId: string, notificationId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        name: userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}` 
          : userData.email || 'Usuário',
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          name: userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}` 
            : userData.email || 'Usuário',
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Territory operations
  async getTerritories(): Promise<Territory[]> {
    return await db
      .select()
      .from(territories)
      .where(eq(territories.isActive, true))
      .orderBy(asc(territories.name));
  }

  async getTerritory(id: string): Promise<Territory | undefined> {
    const [territory] = await db
      .select()
      .from(territories)
      .where(eq(territories.id, id));
    return territory;
  }

  async createTerritory(territoryData: InsertTerritory): Promise<Territory> {
    const [territory] = await db
      .insert(territories)
      .values(territoryData)
      .returning();
    return territory;
  }

  async updateTerritory(id: string, territoryData: Partial<InsertTerritory>): Promise<Territory> {
    const [territory] = await db
      .update(territories)
      .set({ ...territoryData, updatedAt: new Date() })
      .where(eq(territories.id, id))
      .returning();
    return territory;
  }

  async deleteTerritory(id: string): Promise<void> {
    await db
      .update(territories)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(territories.id, id));
  }

  // Block operations
  async getBlocks(territoryId: string): Promise<Block[]> {
    return await db
      .select()
      .from(blocks)
      .where(eq(blocks.territoryId, territoryId))
      .orderBy(asc(blocks.number));
  }

  async getBlock(id: string): Promise<Block | undefined> {
    const [block] = await db
      .select()
      .from(blocks)
      .where(eq(blocks.id, id));
    return block;
  }

  async createBlock(blockData: InsertBlock): Promise<Block> {
    const [block] = await db
      .insert(blocks)
      .values(blockData)
      .returning();
    return block;
  }

  async updateBlock(id: string, blockData: Partial<InsertBlock>): Promise<Block> {
    const [block] = await db
      .update(blocks)
      .set({ ...blockData, updatedAt: new Date() })
      .where(eq(blocks.id, id))
      .returning();
    return block;
  }

  // Preaching day operations
  async getPreachingDays(startDate?: Date, endDate?: Date): Promise<PreachingDay[]> {
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

  async getPreachingDay(id: string): Promise<PreachingDay | undefined> {
    const [day] = await db
      .select()
      .from(preachingDays)
      .where(eq(preachingDays.id, id));
    return day;
  }

  async getPreachingDayByDate(date: Date): Promise<PreachingDay | undefined> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [day] = await db
      .select()
      .from(preachingDays)
      .where(
        and(
          gte(preachingDays.date, startOfDay),
          lte(preachingDays.date, endOfDay)
        )
      );
    return day;
  }

  async createPreachingDay(dayData: InsertPreachingDay): Promise<PreachingDay> {
    const [day] = await db
      .insert(preachingDays)
      .values(dayData)
      .returning();
    return day;
  }

  async updatePreachingDay(id: string, dayData: Partial<InsertPreachingDay>): Promise<PreachingDay> {
    const [day] = await db
      .update(preachingDays)
      .set({ ...dayData, updatedAt: new Date() })
      .where(eq(preachingDays.id, id))
      .returning();
    return day;
  }

  async deletePreachingDay(id: string): Promise<void> {
    await db.delete(preachingDays).where(eq(preachingDays.id, id));
  }

  // Participation operations
  async getParticipations(preachingDayId: string): Promise<Participation[]> {
    return await db
      .select()
      .from(participations)
      .where(eq(participations.preachingDayId, preachingDayId))
      .orderBy(desc(participations.createdAt));
  }

  async getUserParticipations(userId: string): Promise<Participation[]> {
    return await db
      .select()
      .from(participations)
      .where(eq(participations.userId, userId))
      .orderBy(desc(participations.createdAt));
  }

  async createParticipation(participationData: InsertParticipation): Promise<Participation> {
    const [participation] = await db
      .insert(participations)
      .values(participationData)
      .returning();
    return participation;
  }

  async updateParticipation(id: string, participationData: Partial<InsertParticipation>): Promise<Participation> {
    const [participation] = await db
      .update(participations)
      .set({ ...participationData, updatedAt: new Date() })
      .where(eq(participations.id, id))
      .returning();
    return participation;
  }

  async deleteParticipation(id: string): Promise<void> {
    await db.delete(participations).where(eq(participations.id, id));
  }

  // Work session operations
  async getWorkSessions(preachingDayId?: string, blockId?: string): Promise<WorkSession[]> {
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

  async createWorkSession(sessionData: InsertWorkSession): Promise<WorkSession> {
    const [session] = await db
      .insert(workSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async updateWorkSession(id: string, sessionData: Partial<InsertWorkSession>): Promise<WorkSession> {
    const [session] = await db
      .update(workSessions)
      .set({ ...sessionData, updatedAt: new Date() })
      .where(eq(workSessions.id, id))
      .returning();
    return session;
  }

  // Notification operations
  async getNotifications(userId?: string): Promise<Notification[]> {
    if (userId) {
      return await db
        .select({
          id: notifications.id,
          title: notifications.title,
          message: notifications.message,
          type: notifications.type,
          isGlobal: notifications.isGlobal,
          expiresAt: notifications.expiresAt,
          createdAt: notifications.createdAt,
          updatedAt: notifications.updatedAt,
        })
        .from(notifications)
        .leftJoin(userNotifications, 
          and(
            eq(userNotifications.notificationId, notifications.id),
            eq(userNotifications.userId, userId)
          )
        )
        .where(
          and(
            sql`(${notifications.expiresAt} IS NULL OR ${notifications.expiresAt} > NOW())`,
            sql`(${notifications.isGlobal} = true OR ${userNotifications.userId} = ${userId})`
          )
        )
        .orderBy(desc(notifications.createdAt));
    }
    
    return await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.isGlobal, true),
          sql`(${notifications.expiresAt} IS NULL OR ${notifications.expiresAt} > NOW())`
        )
      )
      .orderBy(desc(notifications.createdAt));
  }

  async getUserNotifications(userId: string): Promise<UserNotification[]> {
    return await db
      .select()
      .from(userNotifications)
      .where(eq(userNotifications.userId, userId))
      .orderBy(desc(userNotifications.createdAt));
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async createUserNotification(userNotificationData: InsertUserNotification): Promise<UserNotification> {
    const [userNotification] = await db
      .insert(userNotifications)
      .values(userNotificationData)
      .returning();
    return userNotification;
  }

  async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    await db
      .update(userNotifications)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(userNotifications.userId, userId),
          eq(userNotifications.notificationId, notificationId)
        )
      );
  }
}

export const storage = new DatabaseStorage();
