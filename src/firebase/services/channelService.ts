import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './config';
import { Channel, ChannelSettings, COLLECTIONS } from './types';

export class ChannelService {
  private static instance: ChannelService;
  private channelsCollection = collection(db, COLLECTIONS.CHANNELS);

  static getInstance(): ChannelService {
    if (!ChannelService.instance) {
      ChannelService.instance = new ChannelService();
    }
    return ChannelService.instance;
  }

  // Create a new channel
  async createChannel(channelData: Omit<Channel, 'id' | 'createdAt' | 'updatedAt' | 'userCount'>): Promise<string> {
    try {
      const docRef = await addDoc(this.channelsCollection, {
        ...channelData,
        userCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating channel:', error);
      throw error;
    }
  }

  // Get channel by ID
  async getChannel(channelId: string): Promise<Channel | null> {
    try {
      const channelDoc = await getDoc(doc(this.channelsCollection, channelId));
      return channelDoc.exists() ? { id: channelDoc.id, ...channelDoc.data() } as Channel : null;
    } catch (error) {
      console.error('Error getting channel:', error);
      throw error;
    }
  }

  // Get channel by name
  async getChannelByName(name: string): Promise<Channel | null> {
    try {
      const q = query(this.channelsCollection, where('name', '==', name), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Channel;
      }
      return null;
    } catch (error) {
      console.error('Error getting channel by name:', error);
      throw error;
    }
  }

  // Get all public channels
  async getPublicChannels(): Promise<Channel[]> {
    try {
      const q = query(
        this.channelsCollection,
        where('isPrivate', '==', false),
        orderBy('userCount', 'desc'),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Channel[];
    } catch (error) {
      console.error('Error getting public channels:', error);
      throw error;
    }
  }

  // Get user's channels
  async getUserChannels(userId: string): Promise<Channel[]> {
    try {
      const q = query(
        this.channelsCollection,
        where('users', 'array-contains', userId),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Channel[];
    } catch (error) {
      console.error('Error getting user channels:', error);
      throw error;
    }
  }

  // Join channel
  async joinChannel(channelId: string, userId: string): Promise<void> {
    try {
      const channelRef = doc(this.channelsCollection, channelId);
      const channelDoc = await getDoc(channelRef);

      if (channelDoc.exists()) {
        const channelData = channelDoc.data() as Channel;

        // Check if channel is full
        if (channelData.maxUsers && channelData.userCount >= channelData.maxUsers) {
          throw new Error('Channel is full');
        }

        // Check if user is banned
        if (channelData.settings.bannedUsers?.includes(userId)) {
          throw new Error('You are banned from this channel');
        }

        // Update channel
        await updateDoc(channelRef, {
          users: arrayUnion(userId),
          userCount: channelData.userCount + 1,
          updatedAt: serverTimestamp(),
        });
      } else {
        throw new Error('Channel not found');
      }
    } catch (error) {
      console.error('Error joining channel:', error);
      throw error;
    }
  }

  // Leave channel
  async leaveChannel(channelId: string, userId: string): Promise<void> {
    try {
      const channelRef = doc(this.channelsCollection, channelId);
      const channelDoc = await getDoc(channelRef);

      if (channelDoc.exists()) {
        const channelData = channelDoc.data() as Channel;

        await updateDoc(channelRef, {
          users: arrayRemove(userId),
          userCount: Math.max(0, channelData.userCount - 1),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error leaving channel:', error);
      throw error;
    }
  }

  // Update channel settings
  async updateChannelSettings(channelId: string, settings: Partial<ChannelSettings>): Promise<void> {
    try {
      const channelRef = doc(this.channelsCollection, channelId);
      await updateDoc(channelRef, {
        'settings': settings,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating channel settings:', error);
      throw error;
    }
  }

  // Update channel topic
  async updateChannelTopic(channelId: string, topic: string): Promise<void> {
    try {
      const channelRef = doc(this.channelsCollection, channelId);
      await updateDoc(channelRef, {
        topic,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating channel topic:', error);
      throw error;
    }
  }

  // Add moderator
  async addModerator(channelId: string, userId: string): Promise<void> {
    try {
      const channelRef = doc(this.channelsCollection, channelId);
      await updateDoc(channelRef, {
        moderators: arrayUnion(userId),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding moderator:', error);
      throw error;
    }
  }

  // Remove moderator
  async removeModerator(channelId: string, userId: string): Promise<void> {
    try {
      const channelRef = doc(this.channelsCollection, channelId);
      await updateDoc(channelRef, {
        moderators: arrayRemove(userId),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error removing moderator:', error);
      throw error;
    }
  }

  // Ban user from channel
  async banUser(channelId: string, userId: string): Promise<void> {
    try {
      const channelRef = doc(this.channelsCollection, channelId);
      const channelDoc = await getDoc(channelRef);

      if (channelDoc.exists()) {
        const channelData = channelDoc.data() as Channel;

        // Remove user from channel
        await updateDoc(channelRef, {
          users: arrayRemove(userId),
          userCount: Math.max(0, channelData.userCount - 1),
          'settings.bannedUsers': arrayUnion(userId),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error banning user:', error);
      throw error;
    }
  }

  // Unban user from channel
  async unbanUser(channelId: string, userId: string): Promise<void> {
    try {
      const channelRef = doc(this.channelsCollection, channelId);
      await updateDoc(channelRef, {
        'settings.bannedUsers': arrayRemove(userId),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error unbanning user:', error);
      throw error;
    }
  }

  // Mute user in channel
  async muteUser(channelId: string, userId: string, until: Date): Promise<void> {
    try {
      const channelRef = doc(this.channelsCollection, channelId);
      const channelDoc = await getDoc(channelRef);

      if (channelDoc.exists()) {
        const channelData = channelDoc.data() as Channel;
        const mutedUsers = channelData.settings.mutedUsers || [];

        // Remove existing mute if exists
        const filteredMutes = mutedUsers.filter(mute => mute.userId !== userId);

        await updateDoc(channelRef, {
          'settings.mutedUsers': [...filteredMutes, { userId, until }],
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error muting user:', error);
      throw error;
    }
  }

  // Unmute user in channel
  async unmuteUser(channelId: string, userId: string): Promise<void> {
    try {
      const channelRef = doc(this.channelsCollection, channelId);
      const channelDoc = await getDoc(channelRef);

      if (channelDoc.exists()) {
        const channelData = channelDoc.data() as Channel;
        const mutedUsers = (channelData.settings.mutedUsers || []).filter(mute => mute.userId !== userId);

        await updateDoc(channelRef, {
          'settings.mutedUsers': mutedUsers,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error unmuting user:', error);
      throw error;
    }
  }

  // Check if user is muted
  async isUserMuted(channelId: string, userId: string): Promise<boolean> {
    try {
      const channel = await this.getChannel(channelId);
      if (!channel) return false;

      const mutedUsers = channel.settings.mutedUsers || [];
      const mute = mutedUsers.find(mute => mute.userId === userId);

      if (mute) {
        // Check if mute has expired
        const now = new Date();
        const muteUntil = mute.until.toDate();

        if (now > muteUntil) {
          // Mute expired, remove it
          await this.unmuteUser(channelId, userId);
          return false;
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking if user is muted:', error);
      return false;
    }
  }

  // Subscribe to channel changes
  subscribeToChannel(channelId: string, callback: (channel: Channel | null) => void): () => void {
    const channelRef = doc(this.channelsCollection, channelId);

    return onSnapshot(channelRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as Channel);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error subscribing to channel:', error);
      callback(null);
    });
  }

  // Subscribe to public channels
  subscribeToPublicChannels(callback: (channels: Channel[]) => void): () => void {
    const q = query(
      this.channelsCollection,
      where('isPrivate', '==', false),
      orderBy('userCount', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const channels = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Channel[];
      callback(channels);
    }, (error) => {
      console.error('Error subscribing to public channels:', error);
      callback([]);
    });
  }

  // Delete channel (admin/creator only)
  async deleteChannel(channelId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.channelsCollection, channelId));
    } catch (error) {
      console.error('Error deleting channel:', error);
      throw error;
    }
  }

  // Search channels
  async searchChannels(searchTerm: string): Promise<Channel[]> {
    try {
      const q = query(
        this.channelsCollection,
        where('isPrivate', '==', false),
        orderBy('name')
      );

      const querySnapshot = await getDocs(q);
      const channels = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Channel[];

      // Client-side filtering (basic implementation)
      return channels.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        channel.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching channels:', error);
      throw error;
    }
  }

  // Get channel statistics
  async getChannelStats(channelId: string): Promise<{
    totalMessages: number;
    activeUsers: number;
    averageMessagesPerDay: number;
  }> {
    try {
      // This would require additional queries to messages collection
      // For now, returning basic channel info
      const channel = await this.getChannel(channelId);

      if (!channel) {
        throw new Error('Channel not found');
      }

      return {
        totalMessages: 0, // Would need to query messages collection
        activeUsers: channel.userCount,
        averageMessagesPerDay: 0, // Would need to calculate from messages
      };
    } catch (error) {
      console.error('Error getting channel stats:', error);
      throw error;
    }
  }
}

export const channelService = ChannelService.getInstance();
