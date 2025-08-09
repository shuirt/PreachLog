export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  name: string;
  phone?: string;
  avatar?: string;
  profileImageUrl?: string;
  role: 'ADMIN' | 'COORDINATOR' | 'LEADER' | 'MEMBER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Territory {
  id: string;
  name: string;
  mapImageUrl?: string;
  totalBlocks: number;
  completedBlocks: number;
  completionRate: number;
  lastWorkedAt?: string;
  isActive: boolean;
  description?: string;
  coordinates?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Block {
  id: string;
  number: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REVISIT';
  territoryId: string;
  lastWorkedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PreachingDay {
  id: string;
  date: string;
  departureTime: string;
  meetingPlace: string;
  leaderId: string;
  territoryId?: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Participation {
  id: string;
  userId: string;
  preachingDayId: string;
  attendedAt?: string;
  leftAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkSession {
  id: string;
  preachingDayId: string;
  blockId: string;
  startedAt: string;
  finishedAt?: string;
  notes?: string;
  housesVisited: number;
  contactsMade: number;
  materialsLeft: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' | 'REMINDER';
  isGlobal: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  notificationId: string;
  readAt?: string;
  createdAt: string;
}
