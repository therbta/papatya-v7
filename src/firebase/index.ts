// Export all Firebase services and utilities
export { default as app } from './config';
export { db, auth, storage, analytics } from './config';

// Export services
export { userService } from './services/userService';
export { chatService } from './services/chatService';
export { channelService } from './services/channelService';
export { commandService } from './services/commandService';
export { authService } from './services/authService';

// Export types
export type {
  User,
  UserPreferences,
  ChatMessage,
  Channel,
  ChannelSettings,
  IRCCommand,
  CommandExecution,
  SystemLog,
  PresenceStatus,
  Notification,
} from './types';

export { COLLECTIONS } from './types';
