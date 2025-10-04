import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  startAfter,
  DocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { ChatMessage, COLLECTIONS } from './types';

export class ChatService {
  private static instance: ChatService;
  private messagesCollection = collection(db, COLLECTIONS.MESSAGES);

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Send a message
  async sendMessage(messageData: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<string> {
    try {
      const docRef = await addDoc(this.messagesCollection, {
        ...messageData,
        timestamp: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get messages for a channel
  async getChannelMessages(
    channelId: string,
    limitCount: number = 50,
    lastMessage?: DocumentSnapshot
  ): Promise<ChatMessage[]> {
    try {
      let q = query(
        collection(db, COLLECTIONS.MESSAGES),
        where('channelId', '==', channelId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      if (lastMessage) {
        q = query(
          collection(db, COLLECTIONS.MESSAGES),
          where('channelId', '==', channelId),
          orderBy('timestamp', 'desc'),
          startAfter(lastMessage),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
    } catch (error) {
      console.error('Error getting channel messages:', error);
      throw error;
    }
  }

  // Get recent messages for multiple channels
  async getRecentMessages(channelIds: string[], limitCount: number = 20): Promise<ChatMessage[]> {
    try {
      const batch = channelIds.map(async (channelId) => {
        const q = query(
          collection(db, COLLECTIONS.MESSAGES),
          where('channelId', '==', channelId),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatMessage[];
      });

      const results = await Promise.all(batch);
      return results.flat().sort((a, b) =>
        (b.timestamp as Timestamp).toMillis() - (a.timestamp as Timestamp).toMillis()
      );
    } catch (error) {
      console.error('Error getting recent messages:', error);
      throw error;
    }
  }

  // Search messages
  async searchMessages(
    channelId: string,
    searchTerm: string,
    limitCount: number = 50
  ): Promise<ChatMessage[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // For production, consider using Algolia or Elasticsearch
      const q = query(
        collection(db, COLLECTIONS.MESSAGES),
        where('channelId', '==', channelId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];

      // Client-side filtering (basic implementation)
      return messages.filter(message =>
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }

  // Subscribe to channel messages (real-time)
  subscribeToChannelMessages(
    channelId: string,
    callback: (messages: ChatMessage[]) => void,
    limitCount: number = 50
  ): () => void {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('channelId', '==', channelId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];

      // Reverse to show oldest first
      callback(messages.reverse());
    }, (error) => {
      console.error('Error subscribing to channel messages:', error);
      callback([]);
    });
  }

  // Subscribe to new messages (for notifications)
  subscribeToNewMessages(
    channelIds: string[],
    callback: (message: ChatMessage) => void
  ): () => void {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('channelId', 'in', channelIds),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    return onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const latestMessage = querySnapshot.docs[0];
        const message = {
          id: latestMessage.id,
          ...latestMessage.data()
        } as ChatMessage;
        callback(message);
      }
    }, (error) => {
      console.error('Error subscribing to new messages:', error);
    });
  }

  // Delete message (admin/moderator only)
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.messagesCollection, messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Edit message
  async editMessage(messageId: string, newContent: string): Promise<void> {
    try {
      const messageRef = doc(this.messagesCollection, messageId);
      await updateDoc(messageRef, {
        message: newContent,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  // Send system message
  async sendSystemMessage(
    channelId: string,
    message: string,
    messageType: ChatMessage['messageType'] = 'system'
  ): Promise<string> {
    try {
      const systemMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        channelId,
        userId: 'system',
        nickname: 'System',
        message,
        messageType,
      };

      return await this.sendMessage(systemMessage);
    } catch (error) {
      console.error('Error sending system message:', error);
      throw error;
    }
  }

  // Send join/part/quit message
  async sendUserEventMessage(
    channelId: string,
    userId: string,
    nickname: string,
    eventType: 'join' | 'part' | 'quit' | 'nick_change',
    additionalData?: {
      newNickname?: string;
      reason?: string;
    }
  ): Promise<string> {
    try {
      let message = '';

      switch (eventType) {
        case 'join':
          message = `${nickname} joined the channel`;
          break;
        case 'part':
          message = `${nickname} left the channel${additionalData?.reason ? ` (${additionalData.reason})` : ''}`;
          break;
        case 'quit':
          message = `${nickname} disconnected`;
          break;
        case 'nick_change':
          message = `${nickname} changed nickname to ${additionalData?.newNickname}`;
          break;
      }

      const eventMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        channelId,
        userId,
        nickname,
        message,
        messageType: eventType,
      };

      return await this.sendMessage(eventMessage);
    } catch (error) {
      console.error('Error sending user event message:', error);
      throw error;
    }
  }

  // Get message statistics
  async getMessageStats(channelId: string, timeRange: 'day' | 'week' | 'month' = 'day'): Promise<{
    totalMessages: number;
    uniqueUsers: number;
    averageMessagesPerUser: number;
  }> {
    try {
      const now = new Date();
      let startTime: Date;

      switch (timeRange) {
        case 'day':
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      const q = query(
        collection(db, COLLECTIONS.MESSAGES),
        where('channelId', '==', channelId),
        where('timestamp', '>=', Timestamp.fromDate(startTime)),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs.map(doc => doc.data()) as ChatMessage[];

      const uniqueUsers = new Set(messages.map(msg => msg.userId)).size;

      return {
        totalMessages: messages.length,
        uniqueUsers,
        averageMessagesPerUser: uniqueUsers > 0 ? messages.length / uniqueUsers : 0,
      };
    } catch (error) {
      console.error('Error getting message stats:', error);
      throw error;
    }
  }

  // Batch delete messages (admin only)
  async batchDeleteMessages(messageIds: string[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      messageIds.forEach(messageId => {
        const messageRef = doc(this.messagesCollection, messageId);
        batch.delete(messageRef);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error batch deleting messages:', error);
      throw error;
    }
  }
}

export const chatService = ChatService.getInstance();
