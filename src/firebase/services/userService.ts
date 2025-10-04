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
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { User, UserPreferences, COLLECTIONS } from './types';

export class UserService {
  private static instance: UserService;
  private usersCollection = collection(db, COLLECTIONS.USERS);

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // Create or update user
  async createOrUpdateUser(userData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(this.usersCollection, userData.uid!);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          ...userData,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new user
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: 'online',
          lastSeen: serverTimestamp(),
          isAdmin: false,
          isModerator: false,
          opLevel: '',
          channels: [],
          ignoredUsers: [],
          preferences: {
            theme: 'classic',
            soundEnabled: true,
            notificationsEnabled: true,
            autoJoinChannels: [],
            fontSize: 'medium',
          },
        });
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUser(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(this.usersCollection, uid));
      return userDoc.exists() ? (userDoc.data() as User) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  // Get user by nickname
  async getUserByNickname(nickname: string): Promise<User | null> {
    try {
      const q = query(this.usersCollection, where('nickname', '==', nickname), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by nickname:', error);
      throw error;
    }
  }

  // Get online users
  async getOnlineUsers(): Promise<User[]> {
    try {
      const q = query(
        this.usersCollection,
        where('status', '==', 'online'),
        orderBy('lastSeen', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error getting online users:', error);
      throw error;
    }
  }

  // Update user status
  async updateUserStatus(uid: string, status: User['status']): Promise<void> {
    try {
      const userRef = doc(this.usersCollection, uid);
      await updateDoc(userRef, {
        status,
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Update user preferences
  async updateUserPreferences(uid: string, preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const userRef = doc(this.usersCollection, uid);
      await updateDoc(userRef, {
        'preferences': preferences,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // Add user to channel
  async addUserToChannel(uid: string, channelId: string): Promise<void> {
    try {
      const userRef = doc(this.usersCollection, uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const channels = userData.channels || [];

        if (!channels.includes(channelId)) {
          await updateDoc(userRef, {
            channels: [...channels, channelId],
            updatedAt: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error('Error adding user to channel:', error);
      throw error;
    }
  }

  // Remove user from channel
  async removeUserFromChannel(uid: string, channelId: string): Promise<void> {
    try {
      const userRef = doc(this.usersCollection, uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const channels = (userData.channels || []).filter(id => id !== channelId);

        await updateDoc(userRef, {
          channels,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error removing user from channel:', error);
      throw error;
    }
  }

  // Add user to ignore list
  async ignoreUser(uid: string, targetUserId: string): Promise<void> {
    try {
      const userRef = doc(this.usersCollection, uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const ignoredUsers = userData.ignoredUsers || [];

        if (!ignoredUsers.includes(targetUserId)) {
          await updateDoc(userRef, {
            ignoredUsers: [...ignoredUsers, targetUserId],
            updatedAt: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error('Error ignoring user:', error);
      throw error;
    }
  }

  // Remove user from ignore list
  async unignoreUser(uid: string, targetUserId: string): Promise<void> {
    try {
      const userRef = doc(this.usersCollection, uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const ignoredUsers = (userData.ignoredUsers || []).filter(id => id !== targetUserId);

        await updateDoc(userRef, {
          ignoredUsers,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error unignoring user:', error);
      throw error;
    }
  }

  // Subscribe to user changes
  subscribeToUser(uid: string, callback: (user: User | null) => void): () => void {
    const userRef = doc(this.usersCollection, uid);

    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as User);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error subscribing to user:', error);
      callback(null);
    });
  }

  // Subscribe to online users
  subscribeToOnlineUsers(callback: (users: User[]) => void): () => void {
    const q = query(
      this.usersCollection,
      where('status', '==', 'online'),
      orderBy('lastSeen', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      callback(users);
    }, (error) => {
      console.error('Error subscribing to online users:', error);
      callback([]);
    });
  }

  // Delete user (admin only)
  async deleteUser(uid: string): Promise<void> {
    try {
      await deleteDoc(doc(this.usersCollection, uid));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Batch update multiple users
  async batchUpdateUsers(updates: { uid: string; data: Partial<User> }[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      updates.forEach(({ uid, data }) => {
        const userRef = doc(this.usersCollection, uid);
        batch.update(userRef, {
          ...data,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error batch updating users:', error);
      throw error;
    }
  }
}

export const userService = UserService.getInstance();
