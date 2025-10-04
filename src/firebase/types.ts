import { Timestamp } from 'firebase/firestore';

// User Types
export interface User {
  uid: string;
  nickname: string;
  email?: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'invisible';
  lastSeen: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isAdmin?: boolean;
  isModerator?: boolean;
  opLevel?: '~' | '&' | '@' | '%' | '+' | '';
  channels?: string[];
  ignoredUsers?: string[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'classic' | 'modern' | 'dark';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoJoinChannels: string[];
  fontSize: 'small' | 'medium' | 'large';
}

// Chat Types
export interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  nickname: string;
  message: string;
  timestamp: Timestamp;
  messageType: 'chat' | 'system' | 'join' | 'part' | 'quit' | 'nick_change' | 'kick' | 'ban';
  isCommand?: boolean;
  commandType?: string;
  targetUser?: string;
  metadata?: {
    color?: string;
    font?: string;
    isAction?: boolean;
    isNotice?: boolean;
  };
}

// Channel Types
export interface Channel {
  id: string;
  name: string;
  topic?: string;
  description?: string;
  isPrivate: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  moderators: string[];
  users: string[];
  userCount: number;
  maxUsers?: number;
  settings: ChannelSettings;
}

export interface ChannelSettings {
  allowGuests: boolean;
  requireAuth: boolean;
  enableLogging: boolean;
  maxMessageLength: number;
  rateLimit: {
    messages: number;
    timeWindow: number; // in seconds
  };
  bannedUsers?: string[];
  mutedUsers?: { userId: string; until: Timestamp }[];
}

// Command Types
export interface IRCCommand {
  id: string;
  command: string;
  description: string;
  usage: string;
  category: 'user' | 'channel' | 'admin' | 'system';
  permissions: string[];
  isEnabled: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CommandExecution {
  id: string;
  userId: string;
  command: string;
  args: string[];
  channelId?: string;
  targetUserId?: string;
  timestamp: Timestamp;
  success: boolean;
  errorMessage?: string;
  result?: any;
}

// System Types
export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  userId?: string;
  channelId?: string;
  timestamp: Timestamp;
  metadata?: any;
}

// Real-time Types
export interface PresenceStatus {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'invisible';
  lastSeen: Timestamp;
  currentChannel?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'mention' | 'system' | 'channel_invite';
  title: string;
  message: string;
  read: boolean;
  timestamp: Timestamp;
  channelId?: string;
  fromUserId?: string;
}

// Collection References
export const COLLECTIONS = {
  USERS: 'users',
  CHANNELS: 'channels',
  MESSAGES: 'messages',
  COMMANDS: 'commands',
  COMMAND_EXECUTIONS: 'commandExecutions',
  SYSTEM_LOGS: 'systemLogs',
  PRESENCE: 'presence',
  NOTIFICATIONS: 'notifications',
} as const;
