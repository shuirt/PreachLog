import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertTerritorySchema,
  insertBlockSchema,
  insertPreachingDaySchema,
  insertParticipationSchema,
  insertWorkSessionSchema,
  insertNotificationSchema,
  insertUserNotificationSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Territory routes
  app.get('/api/territories', isAuthenticated, async (req, res) => {
    try {
      const territories = await storage.getTerritories();
      res.json(territories);
    } catch (error) {
      console.error("Error fetching territories:", error);
      res.status(500).json({ message: "Failed to fetch territories" });
    }
  });

  app.get('/api/territories/:id', isAuthenticated, async (req, res) => {
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

  app.post('/api/territories', isAuthenticated, async (req: any, res) => {
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

  app.put('/api/territories/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/territories/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteTerritory(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting territory:", error);
      res.status(500).json({ message: "Failed to delete territory" });
    }
  });

  // Block routes
  app.get('/api/territories/:territoryId/blocks', isAuthenticated, async (req, res) => {
    try {
      const blocks = await storage.getBlocks(req.params.territoryId);
      res.json(blocks);
    } catch (error) {
      console.error("Error fetching blocks:", error);
      res.status(500).json({ message: "Failed to fetch blocks" });
    }
  });

  app.post('/api/blocks', isAuthenticated, async (req, res) => {
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

  app.put('/api/blocks/:id', isAuthenticated, async (req, res) => {
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

  // Preaching day routes
  app.get('/api/preaching-days', isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      const days = await storage.getPreachingDays(start, end);
      res.json(days);
    } catch (error) {
      console.error("Error fetching preaching days:", error);
      res.status(500).json({ message: "Failed to fetch preaching days" });
    }
  });

  app.get('/api/preaching-days/today', isAuthenticated, async (req, res) => {
    try {
      const today = new Date();
      const day = await storage.getPreachingDayByDate(today);
      res.json(day || null);
    } catch (error) {
      console.error("Error fetching today's preaching day:", error);
      res.status(500).json({ message: "Failed to fetch today's preaching day" });
    }
  });

  app.get('/api/preaching-days/:id', isAuthenticated, async (req, res) => {
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

  app.post('/api/preaching-days', isAuthenticated, async (req, res) => {
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

  app.put('/api/preaching-days/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/preaching-days/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deletePreachingDay(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting preaching day:", error);
      res.status(500).json({ message: "Failed to delete preaching day" });
    }
  });

  // Participation routes
  app.get('/api/preaching-days/:id/participations', isAuthenticated, async (req, res) => {
    try {
      const participations = await storage.getParticipations(req.params.id);
      res.json(participations);
    } catch (error) {
      console.error("Error fetching participations:", error);
      res.status(500).json({ message: "Failed to fetch participations" });
    }
  });

  app.get('/api/users/:userId/participations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.userId;
      // Check if user is accessing their own data or is admin
      if (userId !== req.user.claims.sub) {
        const currentUser = await storage.getUser(req.user.claims.sub);
        if (!currentUser || currentUser.role !== 'ADMIN') {
          return res.status(403).json({ message: "Forbidden" });
        }
      }
      
      const participations = await storage.getUserParticipations(userId);
      res.json(participations);
    } catch (error) {
      console.error("Error fetching user participations:", error);
      res.status(500).json({ message: "Failed to fetch user participations" });
    }
  });

  app.post('/api/participations', isAuthenticated, async (req: any, res) => {
    try {
      const data = insertParticipationSchema.parse(req.body);
      // Ensure user can only create participation for themselves unless admin
      if (data.userId !== req.user.claims.sub) {
        const currentUser = await storage.getUser(req.user.claims.sub);
        if (!currentUser || !['ADMIN', 'COORDINATOR', 'LEADER'].includes(currentUser.role)) {
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

  app.put('/api/participations/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/participations/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteParticipation(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting participation:", error);
      res.status(500).json({ message: "Failed to delete participation" });
    }
  });

  // Work session routes
  app.get('/api/work-sessions', isAuthenticated, async (req, res) => {
    try {
      const { preachingDayId, blockId } = req.query;
      const sessions = await storage.getWorkSessions(
        preachingDayId as string,
        blockId as string
      );
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching work sessions:", error);
      res.status(500).json({ message: "Failed to fetch work sessions" });
    }
  });

  app.post('/api/work-sessions', isAuthenticated, async (req, res) => {
    try {
      const data = insertWorkSessionSchema.parse(req.body);
      const session = await storage.createWorkSession(data);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating work session:", error);
      res.status(500).json({ message: "Failed to create work session" });
    }
  });

  app.put('/api/work-sessions/:id', isAuthenticated, async (req, res) => {
    try {
      const data = insertWorkSessionSchema.partial().parse(req.body);
      const session = await storage.updateWorkSession(req.params.id, data);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating work session:", error);
      res.status(500).json({ message: "Failed to update work session" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get('/api/users/:userId/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.userId;
      // Check if user is accessing their own data or is admin
      if (userId !== req.user.claims.sub) {
        const currentUser = await storage.getUser(req.user.claims.sub);
        if (!currentUser || currentUser.role !== 'ADMIN') {
          return res.status(403).json({ message: "Forbidden" });
        }
      }
      
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      res.status(500).json({ message: "Failed to fetch user notifications" });
    }
  });

  app.post('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      // Only admins can create notifications
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser || !['ADMIN', 'COORDINATOR'].includes(currentUser.role)) {
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

  app.post('/api/user-notifications', isAuthenticated, async (req, res) => {
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

  app.put('/api/notifications/:notificationId/read', isAuthenticated, async (req: any, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
