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
  addDoc
} from 'firebase/firestore';
import { db } from './config';
import { IRCCommand, CommandExecution, COLLECTIONS } from './types';

export class CommandService {
  private static instance: CommandService;
  private commandsCollection = collection(db, COLLECTIONS.COMMANDS);
  private executionsCollection = collection(db, COLLECTIONS.COMMAND_EXECUTIONS);

  static getInstance(): CommandService {
    if (!CommandService.instance) {
      CommandService.instance = new CommandService();
    }
    return CommandService.instance;
  }

  // Built-in IRC commands
  private builtInCommands: IRCCommand[] = [
    {
      id: 'join',
      command: '/join',
      description: 'Join a channel',
      usage: '/join <channel>',
      category: 'channel',
      permissions: ['user'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'part',
      command: '/part',
      description: 'Leave a channel',
      usage: '/part [channel] [reason]',
      category: 'channel',
      permissions: ['user'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'nick',
      command: '/nick',
      description: 'Change nickname',
      usage: '/nick <new_nickname>',
      category: 'user',
      permissions: ['user'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'whois',
      command: '/whois',
      description: 'Get user information',
      usage: '/whois <nickname>',
      category: 'user',
      permissions: ['user'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'ping',
      command: '/ping',
      description: 'Ping a user',
      usage: '/ping <nickname>',
      category: 'user',
      permissions: ['user'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'notice',
      command: '/notice',
      description: 'Send a notice to a user',
      usage: '/notice <nickname> <message>',
      category: 'user',
      permissions: ['user'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'ignore',
      command: '/ignore',
      description: 'Ignore a user',
      usage: '/ignore <nickname>',
      category: 'user',
      permissions: ['user'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'kick',
      command: '/kick',
      description: 'Kick a user from channel',
      usage: '/kick <nickname> [reason]',
      category: 'admin',
      permissions: ['moderator', 'admin'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'ban',
      command: '/ban',
      description: 'Ban a user from channel',
      usage: '/ban <nickname> [reason]',
      category: 'admin',
      permissions: ['moderator', 'admin'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'mute',
      command: '/mute',
      description: 'Mute a user in channel',
      usage: '/mute <nickname> [duration]',
      category: 'admin',
      permissions: ['moderator', 'admin'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'topic',
      command: '/topic',
      description: 'Set or view channel topic',
      usage: '/topic [new_topic]',
      category: 'channel',
      permissions: ['user'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'list',
      command: '/list',
      description: 'List all channels',
      usage: '/list [pattern]',
      category: 'channel',
      permissions: ['user'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'help',
      command: '/help',
      description: 'Show help information',
      usage: '/help [command]',
      category: 'system',
      permissions: ['user'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'about',
      command: '/about',
      description: 'Show application information',
      usage: '/about',
      category: 'system',
      permissions: ['user'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
    {
      id: 'time',
      command: '/time',
      description: 'Show server time',
      usage: '/time',
      category: 'system',
      permissions: ['user'],
      isEnabled: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    },
  ];

  // Initialize built-in commands
  async initializeCommands(): Promise<void> {
    try {
      for (const command of this.builtInCommands) {
        const commandRef = doc(this.commandsCollection, command.id);
        const commandDoc = await getDoc(commandRef);

        if (!commandDoc.exists()) {
          await setDoc(commandRef, command);
        }
      }
    } catch (error) {
      console.error('Error initializing commands:', error);
      throw error;
    }
  }

  // Get all commands
  async getAllCommands(): Promise<IRCCommand[]> {
    try {
      const q = query(this.commandsCollection, orderBy('category'), orderBy('command'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IRCCommand[];
    } catch (error) {
      console.error('Error getting all commands:', error);
      throw error;
    }
  }

  // Get commands by category
  async getCommandsByCategory(category: IRCCommand['category']): Promise<IRCCommand[]> {
    try {
      const q = query(
        this.commandsCollection,
        where('category', '==', category),
        where('isEnabled', '==', true),
        orderBy('command')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IRCCommand[];
    } catch (error) {
      console.error('Error getting commands by category:', error);
      throw error;
    }
  }

  // Get command by name
  async getCommand(commandName: string): Promise<IRCCommand | null> {
    try {
      const q = query(
        this.commandsCollection,
        where('command', '==', commandName),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as IRCCommand;
      }
      return null;
    } catch (error) {
      console.error('Error getting command:', error);
      throw error;
    }
  }

  // Execute command
  async executeCommand(
    commandData: Omit<CommandExecution, 'id' | 'timestamp'>
  ): Promise<{ success: boolean; result?: any; errorMessage?: string }> {
    try {
      // Log command execution
      const executionRef = await addDoc(this.executionsCollection, {
        ...commandData,
        timestamp: serverTimestamp(),
      });

      // Get command definition
      const command = await this.getCommand(commandData.command);
      if (!command) {
        return {
          success: false,
          errorMessage: `Unknown command: ${commandData.command}`,
        };
      }

      // Check if command is enabled
      if (!command.isEnabled) {
        return {
          success: false,
          errorMessage: `Command ${commandData.command} is disabled`,
        };
      }

      // Execute the command based on its type
      const result = await this.processCommand(command, commandData);

      // Update execution with result
      await updateDoc(executionRef, {
        success: result.success,
        result: result.result,
        errorMessage: result.errorMessage,
      });

      return result;
    } catch (error) {
      console.error('Error executing command:', error);
      return {
        success: false,
        errorMessage: `Execution error: ${error}`,
      };
    }
  }

  // Process individual commands
  private async processCommand(command: IRCCommand, execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<{
    success: boolean;
    result?: any;
    errorMessage?: string;
  }> {
    try {
      switch (command.id) {
        case 'join':
          return await this.handleJoinCommand(execution);
        case 'part':
          return await this.handlePartCommand(execution);
        case 'nick':
          return await this.handleNickCommand(execution);
        case 'whois':
          return await this.handleWhoisCommand(execution);
        case 'ping':
          return await this.handlePingCommand(execution);
        case 'notice':
          return await this.handleNoticeCommand(execution);
        case 'ignore':
          return await this.handleIgnoreCommand(execution);
        case 'kick':
          return await this.handleKickCommand(execution);
        case 'ban':
          return await this.handleBanCommand(execution);
        case 'mute':
          return await this.handleMuteCommand(execution);
        case 'topic':
          return await this.handleTopicCommand(execution);
        case 'list':
          return await this.handleListCommand(execution);
        case 'help':
          return await this.handleHelpCommand(execution);
        case 'about':
          return await this.handleAboutCommand(execution);
        case 'time':
          return await this.handleTimeCommand(execution);
        default:
          return {
            success: false,
            errorMessage: `Command ${command.command} not implemented`,
          };
      }
    } catch (error) {
      return {
        success: false,
        errorMessage: `Command processing error: ${error}`,
      };
    }
  }

  // Command handlers (these would integrate with other services)
  private async handleJoinCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    // Implementation would integrate with channelService
    return { success: true, result: 'Joined channel' };
  }

  private async handlePartCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'Left channel' };
  }

  private async handleNickCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'Nickname changed' };
  }

  private async handleWhoisCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'User information' };
  }

  private async handlePingCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'Pong!' };
  }

  private async handleNoticeCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'Notice sent' };
  }

  private async handleIgnoreCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'User ignored' };
  }

  private async handleKickCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'User kicked' };
  }

  private async handleBanCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'User banned' };
  }

  private async handleMuteCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'User muted' };
  }

  private async handleTopicCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'Topic updated' };
  }

  private async handleListCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'Channel list' };
  }

  private async handleHelpCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'Help information' };
  }

  private async handleAboutCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: 'PAPATYA v7 - Web-based IRC Client' };
  }

  private async handleTimeCommand(execution: Omit<CommandExecution, 'id' | 'timestamp'>): Promise<any> {
    return { success: true, result: new Date().toISOString() };
  }

  // Create custom command
  async createCustomCommand(commandData: Omit<IRCCommand, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(this.commandsCollection, {
        ...commandData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating custom command:', error);
      throw error;
    }
  }

  // Update command
  async updateCommand(commandId: string, updates: Partial<IRCCommand>): Promise<void> {
    try {
      const commandRef = doc(this.commandsCollection, commandId);
      await updateDoc(commandRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating command:', error);
      throw error;
    }
  }

  // Delete command
  async deleteCommand(commandId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.commandsCollection, commandId));
    } catch (error) {
      console.error('Error deleting command:', error);
      throw error;
    }
  }

  // Get command execution history
  async getCommandHistory(
    userId?: string,
    command?: string,
    limitCount: number = 50
  ): Promise<CommandExecution[]> {
    try {
      let q = query(
        this.executionsCollection,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      if (userId) {
        q = query(
          this.executionsCollection,
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
      }

      if (command) {
        q = query(
          this.executionsCollection,
          where('command', '==', command),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommandExecution[];
    } catch (error) {
      console.error('Error getting command history:', error);
      throw error;
    }
  }

  // Subscribe to command changes
  subscribeToCommands(callback: (commands: IRCCommand[]) => void): () => void {
    const q = query(this.commandsCollection, orderBy('category'), orderBy('command'));

    return onSnapshot(q, (querySnapshot) => {
      const commands = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IRCCommand[];
      callback(commands);
    }, (error) => {
      console.error('Error subscribing to commands:', error);
      callback([]);
    });
  }
}

export const commandService = CommandService.getInstance();
