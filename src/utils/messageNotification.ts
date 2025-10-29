/**
 * Utility functions for tracking unseen messages
 * Uses localStorage for persistence across sessions
 */

const STORAGE_KEY = 'papatya_unseen_messages';

export interface UnseenMessages {
  [channelOrUser: string]: {
    lastSeenIndex: number; // Index of the last seen message in the array
    lastSeenTimestamp: number; // Timestamp of last seen message
  };
}

/**
 * Get all unseen message tracking data from localStorage
 */
export const getUnseenMessages = (): UnseenMessages => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading unseen messages from localStorage:', error);
    return {};
  }
};

/**
 * Save unseen message tracking data to localStorage
 */
export const saveUnseenMessages = (data: UnseenMessages): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving unseen messages to localStorage:', error);
  }
};

/**
 * Mark all messages as seen for a channel/user
 */
export const markAsSeen = (channelOrUser: string, messageCount: number): void => {
  const unseenData = getUnseenMessages();
  unseenData[channelOrUser] = {
    lastSeenIndex: messageCount - 1, // Last index in array (includes all message types)
    lastSeenTimestamp: Date.now(),
  };
  saveUnseenMessages(unseenData);
};

/**
 * Get count of chat messages (excluding system events like join/leave)
 */
export const getChatMessageCount = (messages: Array<any>): number => {
  return messages.filter(msg => msg.event === 'chat').length;
};

/**
 * Check if a channel/user has unseen chat messages
 * Only counts actual chat messages, not system events (login, quit, nick_change)
 */
export const hasUnseenMessages = (
  channelOrUser: string,
  messages: Array<any>,
  currentMessageCount?: number
): boolean => {
  const unseenData = getUnseenMessages();
  const tracking = unseenData[channelOrUser];

  // If no tracking data exists, assume all messages are seen (to prevent false positives on first load)
  if (!tracking) {
    return false;
  }

  // Count only chat messages (exclude system events)
  const chatMessages = messages.filter(msg => msg.event === 'chat');
  
  // If there are no chat messages, don't blink
  if (chatMessages.length === 0) {
    return false;
  }

  // Find the last seen chat message index
  let lastSeenChatIndex = -1;
  if (tracking.lastSeenIndex >= 0) {
    // Count how many chat messages were before the last seen index
    for (let i = 0; i <= tracking.lastSeenIndex && i < messages.length; i++) {
      if (messages[i].event === 'chat') {
        lastSeenChatIndex++;
      }
    }
  }

  // If lastSeenIndex is -1, all chat messages are unseen
  if (tracking.lastSeenIndex === -1) {
    return chatMessages.length > 0;
  }

  // Check if there are new chat messages beyond the last seen chat index
  const currentChatCount = getChatMessageCount(messages);
  return currentChatCount > lastSeenChatIndex + 1;
};

/**
 * Force re-check of unseen messages (useful after state updates)
 */
export const checkUnseenMessages = (
  channelOrUser: string,
  messages: Array<any>
): boolean => {
  return hasUnseenMessages(channelOrUser, messages);
};

/**
 * Initialize tracking for a channel/user if it doesn't exist
 */
export const initializeTracking = (channelOrUser: string, initialMessageCount: number): void => {
  const unseenData = getUnseenMessages();
  if (!unseenData[channelOrUser]) {
    markAsSeen(channelOrUser, initialMessageCount);
  }
};

/**
 * Initialize tracking with unseen status (for when user is not viewing the channel)
 */
export const initializeUnseen = (channelOrUser: string, messageCount: number): void => {
  const unseenData = getUnseenMessages();
  if (!unseenData[channelOrUser]) {
    unseenData[channelOrUser] = {
      lastSeenIndex: -1, // -1 means no messages have been seen yet
      lastSeenTimestamp: 0,
    };
    saveUnseenMessages(unseenData);
  }
};

