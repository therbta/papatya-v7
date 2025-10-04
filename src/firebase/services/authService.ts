import {
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config';
import { User } from '../types';
import { userService } from './userService';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Initialize auth service
  initialize(): void {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await this.handleUserSignIn(firebaseUser);
      } else {
        this.handleUserSignOut();
      }
    });
  }

  // Handle user sign in
  private async handleUserSignIn(firebaseUser: FirebaseUser): Promise<void> {
    try {
      // Get or create user document
      let user = await userService.getUser(firebaseUser.uid);

      if (!user) {
        // Create new user document
        const userData: Partial<User> = {
          uid: firebaseUser.uid,
          nickname: firebaseUser.displayName || `User${Math.floor(Math.random() * 1000)}`,
          email: firebaseUser.email || undefined,
          status: 'online',
          lastSeen: serverTimestamp() as any,
          isAdmin: false,
          isModerator: false,
          opLevel: '',
          channels: [],
          ignoredUsers: [],
        };

        await userService.createOrUpdateUser(userData);
        user = await userService.getUser(firebaseUser.uid);
      } else {
        // Update last seen and status
        await userService.updateUserStatus(firebaseUser.uid, 'online');
      }

      this.currentUser = user;
    } catch (error) {
      console.error('Error handling user sign in:', error);
    }
  }

  // Handle user sign out
  private handleUserSignOut(): void {
    if (this.currentUser) {
      // Update user status to offline
      userService.updateUserStatus(this.currentUser.uid, 'offline' as any).catch(console.error);
    }
    this.currentUser = null;
  }

  // Sign in anonymously
  async signInAnonymously(nickname: string): Promise<User | null> {
    try {
      const result = await signInAnonymously(auth);

      if (result.user) {
        // Update the display name
        await updateProfile(result.user, {
          displayName: nickname
        });

        // Create or update user document
        const userData: Partial<User> = {
          uid: result.user.uid,
          nickname,
          status: 'online',
          lastSeen: serverTimestamp() as any,
          isAdmin: false,
          isModerator: false,
          opLevel: '',
          channels: [],
          ignoredUsers: [],
        };

        await userService.createOrUpdateUser(userData);
        return await userService.getUser(result.user.uid);
      }

      return null;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get current Firebase user
  getCurrentFirebaseUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Update user profile
  async updateUserProfile(updates: {
    nickname?: string;
    avatar?: string;
  }): Promise<void> {
    try {
      const firebaseUser = this.getCurrentFirebaseUser();
      if (!firebaseUser || !this.currentUser) {
        throw new Error('User not authenticated');
      }

      // Update Firebase profile
      if (updates.nickname) {
        await updateProfile(firebaseUser, {
          displayName: updates.nickname
        });
      }

      // Update Firestore user document
      await userService.createOrUpdateUser({
        uid: this.currentUser.uid,
        nickname: updates.nickname || this.currentUser.nickname,
        avatar: updates.avatar || this.currentUser.avatar,
      });

      // Refresh current user
      this.currentUser = await userService.getUser(this.currentUser.uid);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Update user status
  async updateUserStatus(status: User['status']): Promise<void> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      await userService.updateUserStatus(this.currentUser.uid, status);
      this.currentUser.status = status;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Check if nickname is available
  async isNicknameAvailable(nickname: string): Promise<boolean> {
    try {
      const existingUser = await userService.getUserByNickname(nickname);
      return !existingUser;
    } catch (error) {
      console.error('Error checking nickname availability:', error);
      return false;
    }
  }

  // Generate unique nickname
  async generateUniqueNickname(baseNickname: string): Promise<string> {
    let nickname = baseNickname;
    let counter = 1;

    while (!(await this.isNicknameAvailable(nickname))) {
      nickname = `${baseNickname}${counter}`;
      counter++;
    }

    return nickname;
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await userService.getUser(firebaseUser.uid);
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

export const authService = AuthService.getInstance();
