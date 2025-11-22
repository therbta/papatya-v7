import React from 'react';

// Consts
import { config, chats, papatyaChats, webcamChats } from '../const';
import { opPriority } from '../const';
import {
  generateJoinLeaveEvents,
  blendChatAndJoinLeaveEvents,
  extractChatOnlyEvents,
  getChannelJoinLeaveDelay,
  channelDensity,
  initializeChannelUsers,
  getAllChannelUsers,
  type ChannelUsers
} from '../joinLeaveData';

// Utils
import { markAsSeen, hasUnseenMessages, initializeTracking, initializeUnseen, getUnseenMessages } from '../utils/messageNotification';
import { getPeerContextMenuItems, getChannelContextMenuItems, getPeerTabContextMenuItems } from '../utils/contextMenuConfigs';
import { generateWhoisInfo, getUserChannels } from '../utils/whoisUtils';
import { generateChannelHeaderInfo } from '../utils/channelHeaderUtils';

// Generate host/IP for join/leave messages (same format as whois)
const generateHostForNickname = (nick: string): string => {
  // Generate consistent random alphanumeric string (8 characters, uppercase) based on nick
  const hash = nick.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomPart = Array.from({ length: 8 }, (_, i) => {
    const charCode = (hash * (i + 1) * 7) % 36;
    return charCode < 10 ? charCode.toString() : String.fromCharCode(charCode - 10 + 65);
  }).join('');

  return `PAPATYAv7@64.81.${randomPart}.sibertr.online`;
};

// Assets
import SideBg from '../assets/yan.jpg';
import BarIcon from '../assets/bar.png';
import ChannelItemIcon from '../assets/channel_icon.png';
import ListItemIcon from '../assets/list_icon.png';

// Components
import MenuBar from '../components/MenuBar';
import Toolbar from '../components/Toolbar';
import Console from '../view/Console';

// Audio
import ConnectedWAV from '../assets/sound/papatyaconnect.wav';
import JoinedWAV from '../assets/sound/papatyajoin.wav';


// Lazy-loaded components
const List = React.lazy(() => import('./List'));
const ChatInput = React.lazy(() => import('./ChatInput'));
const ContextMenu = React.lazy(() => import('../components/ContextMenu'));

// ==============================================================================================


const Emirc = ({ nickname: initialNickname }: { nickname: string }) => {

  // States
  const [actualNickname, setActualNickname] = React.useState(initialNickname);
  const [connected, setConnected] = React.useState(false);
  const nicknameCheckedRef = React.useRef(false);
  const [activeWindow, setActiveWindow] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [channels, setChannels] = React.useState<string[]>([]);
  const [chatUsers, setChatUsers] = React.useState<string[]>([]);

  // Separate chat data for each channel
  const [channelChatData, setChannelChatData] = React.useState<Record<string, Array<any>>>({});
  const [channelLoadingComplete, setChannelLoadingComplete] = React.useState<Record<string, boolean>>({});
  const [channelUserManagement, setChannelUserManagement] = React.useState<Record<string, ChannelUsers>>({});

  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingMessages, setLoadingMessages] = React.useState<Array<{ text: string, color: string }>>([]);
  const [loadingComplete, setLoadingComplete] = React.useState(false);
  const [joiningChannels, setJoiningChannels] = React.useState(false);
  const [listWidth, setListWidth] = React.useState(215);

  // Track last whois time per user (rate limiting: 30 seconds)
  const lastWhoisTimeRef = React.useRef<Map<string, number>>(new Map());

  // Track scroll positions for each channel/private chat
  const chatScrollPositionsRef = React.useRef<Map<string, number>>(new Map());

  // Context menu state for private chat tabs
  const [chatTabContextMenu, setChatTabContextMenu] = React.useState<{ visible: boolean; x: number; y: number; user: string }>({
    visible: false,
    x: 0,
    y: 0,
    user: ''
  });

  // Context menu state for channel tabs
  const [channelTabContextMenu, setChannelTabContextMenu] = React.useState<{ visible: boolean; x: number; y: number; channel: string }>({
    visible: false,
    x: 0,
    y: 0,
    channel: ''
  });

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (chatTabContextMenu.visible) {
        setChatTabContextMenu({ visible: false, x: 0, y: 0, user: '' });
      }
      if (channelTabContextMenu.visible) {
        setChannelTabContextMenu({ visible: false, x: 0, y: 0, channel: '' });
      }
    };

    if (chatTabContextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [chatTabContextMenu.visible]);

  // Cookie functions for persisting user tabs
  const getUserTabsFromCookie = (): string[] => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('papatya_user_tabs='));
    if (cookie) {
      try {
        return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
      } catch {
        return [];
      }
    }
    return [];
  };

  const saveUserTabsToCookie = (users: string[]) => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1); // 1 year expiry
    document.cookie = `papatya_user_tabs=${encodeURIComponent(JSON.stringify(users))};expires=${expires.toUTCString()};path=/`;
  };

  // Load user tabs from cookie on mount
  React.useEffect(() => {
    const savedUsers = getUserTabsFromCookie();
    if (savedUsers.length > 0) {
      setChatUsers(savedUsers);
      console.log('Loaded user tabs from cookie:', savedUsers);
    }
  }, []);

  // Save user tabs to cookie whenever they change
  React.useEffect(() => {
    if (chatUsers.length > 0) {
      saveUserTabsToCookie(chatUsers);
      console.log('Saved user tabs to cookie:', chatUsers);
    }
  }, [chatUsers]);

  // Mark messages as seen when switching to a tab or when viewing the active tab
  React.useEffect(() => {
    if (activeWindow !== null) {
      const messages = channelChatData[activeWindow] || [];
      if (messages.length > 0) {
        markAsSeen(activeWindow, messages.length);
      }
    }
  }, [activeWindow, channelChatData]);

  // Initialize tracking for all channels and users when messages are loaded
  React.useEffect(() => {
    // Initialize channels
    channels.forEach(channel => {
      const channelName = `#${channel}`;
      const messages = channelChatData[channelName] || [];
      if (messages.length > 0) {
        const unseenData = getUnseenMessages();
        if (!unseenData[channelName]) {
          // First time seeing messages for this channel
          if (activeWindow === channelName) {
            // User is viewing this channel, mark all as seen
            markAsSeen(channelName, messages.length);
          } else {
            // User is not viewing, mark as all unseen initially
            initializeUnseen(channelName, messages.length);
          }
        }
      }
    });
    
    // Initialize users
    chatUsers.forEach(user => {
      const messages = channelChatData[user] || [];
      if (messages.length > 0) {
        const unseenData = getUnseenMessages();
        if (!unseenData[user]) {
          // First time seeing messages for this user
          if (activeWindow === user) {
            // User is viewing this chat, mark all as seen
            markAsSeen(user, messages.length);
          } else {
            // User is not viewing, mark as all unseen initially
            initializeUnseen(user, messages.length);
          }
        }
      }
    });
  }, [channels, chatUsers, channelChatData, activeWindow]);

  React.useEffect(() => {
    // Start loading sequence immediately
    setIsLoading(true);

    // After 3 seconds, complete loading and connect
    setTimeout(() => {
      setConnected(true);

      // Play connected sound
      const audio = new Audio(ConnectedWAV);
      audio.play();

      // Start joining channels after connection
      setJoiningChannels(true);

      // Keep loading mock visible in console (don't set isLoading to false)
    }, 3000);

  }, []);

  // Join channels one by one realistically after connection
  React.useEffect(() => {
    if (joiningChannels && channels.length < config.channels.length) {
      const channelIndex = channels.length;
      const delay = channelIndex === 0 ? 500 : 800 + Math.random() * 400; // 800-1200ms between joins

      const timer = setTimeout(() => {
        const channelToJoin = config.channels[channelIndex];
        const channelName = `#${channelToJoin}`;

        // Add channel to the list
        setChannels(prev => [...prev, channelToJoin]);

        // Generate channel header info (only if channel doesn't have header messages yet)
        const existingMessages = channelChatData[channelName] || [];
        const hasHeader = existingMessages.some((msg: any) => msg.event === 'channel_header');
        const headerMessages: Array<any> = [];

        if (!hasHeader && setChannelChatData) {
          // Get total user count for this channel (use a reasonable default if not available yet)
          // The user management might not be fully initialized, so we'll use a default and update later if needed
          let totalUsers = 200; // Default fallback

          // Try to get from channelUserManagement if available
          const channelUsersData = channelUserManagement[channelName];
          let allChannelUsers: Array<{ nick: string; op: string }> = [];

          if (channelUsersData) {
            totalUsers = channelUsersData.chatUsers.length +
              channelUsersData.stableLurkers.length +
              channelUsersData.cyclingUsers.length;

            // Collect all users for topic writer selection
            allChannelUsers = [
              ...channelUsersData.chatUsers,
              ...channelUsersData.stableLurkers,
              ...channelUsersData.cyclingUsers
            ];
          }

          // Ensure minimum of 50 users for realistic display
          if (totalUsers < 50) {
            totalUsers = 50 + Math.floor(Math.random() * 200);
          }

          const headerInfo = generateChannelHeaderInfo(channelName, totalUsers, allChannelUsers);

          // Create header messages (no timestamp, event type "channel_header")
          headerMessages.push(
            {
              event: "channel_header",
              message: `Kanal Başlığı: ${headerInfo.topicUrl} ${headerInfo.topicMessage}`,
              user: null,
              new_nick: null,
              email: null,
              channel: channelName,
              headerInfo: headerInfo
            },
            {
              event: "channel_header",
              message: `Kanalın Kuruluş Tarihi ${headerInfo.createdDate}`,
              user: null,
              new_nick: null,
              email: null,
              channel: channelName,
              headerInfo: headerInfo
            },
            {
              event: "channel_header",
              message: `Kanal Başlığını Yazan: ${headerInfo.topicSetBy}`,
              user: null,
              new_nick: null,
              email: null,
              channel: channelName,
              headerInfo: headerInfo
            },
            {
              event: "channel_header",
              message: `Kanaldaki Op Sayısı : ${headerInfo.opCount} Voice Sayısı: ${headerInfo.voiceCount} Toplam: ${headerInfo.totalUsers} Kişi Bulunmaktadır`,
              user: null,
              new_nick: null,
              email: null,
              channel: channelName,
              headerInfo: headerInfo
            }
          );
        }

        // Generate join message
        const host = generateHostForNickname(actualNickname);
        const currentTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
        const joinMessage = {
          time: currentTime,
          event: "login",
          user: actualNickname,
          message: `*** Giriş: ${actualNickname} (${host}) ${channelName}`,
          new_nick: null,
          email: host, // Use host as email field for display
          channel: channelName
        };

        // Add header messages and join message to channel
        // Headers should appear at the beginning, before any other messages
        if (setChannelChatData) {
          setChannelChatData(prev => {
            const existingMessages = prev[channelName] || [];
            // If headers exist, don't add them again
            const hasHeader = existingMessages.some((msg: any) => msg.event === 'channel_header');
            if (hasHeader) {
              return prev; // Headers already exist, don't add them again
            }
            // Add headers at the beginning, then existing messages, then join message
            return {
              ...prev,
              [channelName]: [
                ...headerMessages,
                joinMessage,
                ...existingMessages
              ]
            };
          });
        }

        // Add current user's nickname to channel user management chatUsers
        setChannelUserManagement(prev => {
          const currentManagement = prev[channelName];
          if (currentManagement) {
            // Check if user already exists in chatUsers
            const userExists = currentManagement.chatUsers.some(u => u.nick === actualNickname);
            if (!userExists) {
              return {
                ...prev,
                [channelName]: {
                  ...currentManagement,
                  chatUsers: [...currentManagement.chatUsers, { nick: actualNickname, op: '' }]
                }
              };
            }
          } else {
            // Channel user management not initialized yet, initialize it with current user
            return {
              ...prev,
              [channelName]: {
                chatUsers: [{ nick: actualNickname, op: '' }],
                stableLurkers: [],
                cyclingUsers: []
              }
            };
          }
          return prev;
        });

        // Play join sound
        const joinAudio = new Audio(JoinedWAV);
        joinAudio.volume = 0.6;
        joinAudio.play();

        // Set first channel as active window
        if (channelIndex === 0) {
          setActiveWindow(channelName);
        }
      }, delay);

      return () => clearTimeout(timer);
    } else if (joiningChannels && channels.length === config.channels.length) {
      setJoiningChannels(false);
    }
  }, [joiningChannels, channels]);

  // Check nickname conflict and auto-rename if needed
  React.useEffect(() => {
    if (!connected || nicknameCheckedRef.current) return;

    // Wait for channel users to be initialized - check when channels are loaded
    const checkNickname = () => {
      // Make sure we have channel user management data
      const hasChannelData = Object.keys(channelUserManagement).length > 0;

      if (!hasChannelData) {
        // Retry after a short delay if data isn't ready
        setTimeout(checkNickname, 500);
        return;
      }

      // Collect all existing users from all channels
      const allExistingUsers: string[] = [];

      // Check all channels - collect users directly from channelUserManagement
      Object.entries(channelUserManagement).forEach(([channelName, channelUsers]: [string, ChannelUsers]) => {
        // Get all users from chat users, stable lurkers, and cycling users
        const allUsersInChannel = [
          ...channelUsers.chatUsers,
          ...channelUsers.stableLurkers,
          ...channelUsers.cyclingUsers
        ];

        allUsersInChannel.forEach(user => {
          // Remove op prefix for comparison (e.g., ~nickname -> nickname)
          const cleanNick = user.nick.replace(/^[~&@%+]/, '').toLowerCase();
          if (!allExistingUsers.includes(cleanNick)) {
            allExistingUsers.push(cleanNick);
          }
        });
      });

      // Check private chat users
      chatUsers.forEach(user => {
        const cleanNick = user.toLowerCase();
        if (!allExistingUsers.includes(cleanNick)) {
          allExistingUsers.push(cleanNick);
        }
      });

      // Check if initial nickname (case-insensitive) already exists
      const nicknameToCheck = initialNickname.toLowerCase();
      const nicknameExists = allExistingUsers.includes(nicknameToCheck);

      console.log('Nickname check:', {
        initialNickname,
        nicknameToCheck,
        allExistingUsers: allExistingUsers.slice(0, 10), // Log first 10 for debugging
        nicknameExists
      });

      if (nicknameExists) {
        // Generate random nickname like PAPATYAv7-4632
        const randomNumber = Math.floor(Math.random() * 10000);
        const newNickname = `PAPATYAv7-${randomNumber}`;

        setActualNickname(newNickname);
        nicknameCheckedRef.current = true;

        // Add message to console about nickname change (wait for console to be ready)
        setTimeout(() => {
          const nicknameChangeMessage = {
            event: 'system',
            message: `Nickname ${initialNickname} is already in use. Changed to ${newNickname}.`,
            time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
            user: null,
            new_nick: null,
            email: null,
            channel: null
          };

          if (setChannelChatData) {
            setChannelChatData(prev => ({
              ...prev,
              'console': [
                ...(prev['console'] || []),
                nicknameChangeMessage
              ]
            }));
          }
        }, 3500); // Wait 3.5 seconds for console and connection messages to be ready
      } else {
        nicknameCheckedRef.current = true;
      }
    };

    // Start checking after connection, with initial delay
    const checkTimeout = setTimeout(checkNickname, 2000); // Wait 2 seconds for channel users to load

    return () => clearTimeout(checkTimeout);
  }, [connected, channelUserManagement, chatUsers, initialNickname, setChannelChatData]);

  // Initialize channel users (chat users + stable lurkers) immediately on connection
  React.useEffect(() => {
    if (!connected) return;

    const channelsToLoad = [
      { name: '#str_chat', data: chats },
      { name: '#PAPATYA', data: papatyaChats },
      { name: '#Webcam', data: webcamChats }
    ];

    channelsToLoad.forEach(({ name, data }) => {
      if (!channelUserManagement[name]) {
        // Initialize users structure: chat users + stable lurkers (already in channel)
        const userManagement = initializeChannelUsers(name, data);

        setChannelUserManagement(prev => ({
          ...prev,
          [name]: userManagement
        }));
      }
    });
  }, [connected, channelUserManagement]);

  // Track if welcome message has been sent for #str_chat (once per session)
  const welcomeSentRef = React.useRef(false);
  // Track the timeout ID to cancel it if effect re-runs
  const welcomeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Add welcome message from a random op user when joining #str_chat
  React.useEffect(() => {
    // Only for #str_chat, only once, and only if channel is joined and user management is ready
    if (
      !channels.includes('str_chat') ||
      !channelUserManagement['#str_chat'] ||
      welcomeSentRef.current ||
      !setChannelChatData
    ) {
      return;
    }

    const channelUsers = channelUserManagement['#str_chat'];
    if (!channelUsers) return;

    // Get all users with op prefixes (~&@+)
    const allUsers = [
      ...channelUsers.chatUsers,
      ...channelUsers.stableLurkers,
      ...channelUsers.cyclingUsers
    ];

    const opUsers = allUsers.filter(user =>
      user.op && ['~', '&', '@', '+'].includes(user.op)
    );

    if (opUsers.length > 0) {
      // Mark welcome as scheduled IMMEDIATELY to prevent multiple calls
      // Do this first so cleanup doesn't interfere
      welcomeSentRef.current = true;

      // Pick a random op user
      const randomOpUser = opUsers[Math.floor(Math.random() * opUsers.length)];

      // Clear any existing timeout (safety check)
      if (welcomeTimeoutRef.current) {
        clearTimeout(welcomeTimeoutRef.current);
      }

      // Add welcome message from the random op user (with a delay after join)
      welcomeTimeoutRef.current = setTimeout(() => {
        const welcomeTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
        const welcomeMessage = {
          time: welcomeTime,
          event: "chat",
          user: randomOpUser.nick,
          message: `Hos geldin ${actualNickname} :)`,
          new_nick: null,
          email: null,
          channel: '#str_chat'
        };

        setChannelChatData(prev => ({
          ...prev,
          '#str_chat': [
            ...(prev['#str_chat'] || []),
            welcomeMessage
          ]
        }));

        // Clear the timeout ref after message is sent
        welcomeTimeoutRef.current = null;
      }, 7000); // 7 second delay after join to make it feel natural

      // No cleanup needed - once welcomeSentRef is true, we don't want to cancel the timeout
      // The effect will return early on subsequent runs due to welcomeSentRef.current check
    }
  }, [channels, channelUserManagement, actualNickname, setChannelChatData]);

  // Load chat messages + join/leave events for all channels (in background, real-time flow)
  React.useEffect(() => {
    if (!connected) return;

    const channelsToLoad = [
      { name: '#str_chat', data: chats },
      { name: '#PAPATYA', data: papatyaChats },
      { name: '#Webcam', data: webcamChats }
    ];

    channelsToLoad.forEach(({ name, data }) => {
      if (!channelLoadingComplete[name]) {
        // Extract pure chat events
        const chatOnlyEvents = extractChatOnlyEvents(data);

        // Generate join/leave events based on channel density (for cycling users only)
        const density = channelDensity[name as keyof typeof channelDensity];
        const joinLeaveCount = density ? Math.floor(chatOnlyEvents.length * 0.3) : 15; // 30% of chat events
        const joinLeaveEvents = generateJoinLeaveEvents(name, joinLeaveCount);

        // Blend chat and join/leave events
        const blendedData = blendChatAndJoinLeaveEvents(chatOnlyEvents, joinLeaveEvents);

        let delay = 200; // Start after 200ms
        let isMounted = true;

        blendedData.forEach((chat: any, index: number) => {
          setTimeout(() => {
            if (isMounted) {
              setChannelChatData((prev) => ({
                ...prev,
                [name]: [
                  ...(prev[name] || []),
                  {
                    ...chat,
                    time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
                  }
                ]
              }));

              // Track cycling users in channel user management
              if (chat.event === 'login') {
                setChannelUserManagement(prev => {
                  const currentManagement = prev[name];
                  if (currentManagement) {
                    const userExists = currentManagement.cyclingUsers.some(u => u.nick === chat.user);
                    if (!userExists) {
                      return {
                        ...prev,
                        [name]: {
                          ...currentManagement,
                          cyclingUsers: [...currentManagement.cyclingUsers, { nick: chat.user, op: '' }]
                        }
                      };
                    }
                  }
                  return prev;
                });
              } else if (chat.event === 'quit') {
                setChannelUserManagement(prev => {
                  const currentManagement = prev[name];
                  if (currentManagement) {
                    return {
                      ...prev,
                      [name]: {
                        ...currentManagement,
                        cyclingUsers: currentManagement.cyclingUsers.filter(u => u.nick !== chat.user)
                      }
                    };
                  }
                  return prev;
                });
              }

              // Mark loading as complete after last message
              if (index === blendedData.length - 1) {
                setTimeout(() => {
                  setChannelLoadingComplete(prev => ({
                    ...prev,
                    [name]: true
                  }));
                }, 500);
              }
            }
          }, delay);

          // Vary delay based on event type and channel density
          if (chat.event === 'login' || chat.event === 'quit') {
            delay += getChannelJoinLeaveDelay(name, chat.event === 'login');
          } else {
            // Chat messages: 2-8 seconds for realistic chat flow
            delay += Math.random() * 6000 + 2000;
          }
        });

        return () => {
          isMounted = false;
        };
      }
    });
  }, [connected, channelLoadingComplete]);

  // Handle message sending
  const handleSendMessage = (message: string) => {
    if (!activeWindow) return;

    // Handle commands
    if (message.startsWith('/')) {
      const command = message.split(' ')[0].toLowerCase();
      const args = message.split(' ').slice(1).join(' ');

      // Handle /whois command
      if (command === '/whois' && args && connected) {
        const targetUser = args.trim();
        // If we're viewing this user's chat, trigger whois via Peer component
        if (activeWindow === targetUser || activeWindow === args.trim()) {
          // The whois will be shown by double-clicking or via context menu in Peer
          console.log('Whois command for user:', targetUser);
        }
      }

      // Handle /ping command
      if (command === '/ping' && args) {
        const targetUser = args.trim();
        const currentTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
        const pingMessage = {
          time: currentTime,
          event: "chat",
          user: actualNickname,
          message: `Ping request sent to ${targetUser}`,
          new_nick: null,
          email: null,
          channel: null
        };
        setChannelChatData(prev => ({
          ...prev,
          [activeWindow]: [
            ...(prev[activeWindow] || []),
            pingMessage
          ]
        }));
        return;
      }

      // Handle /notice command
      if (command === '/notice' && args) {
        const parts = args.split(' ');
        const targetUser = parts[0];
        const noticeMessage = parts.slice(1).join(' ');
        const currentTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
        const noticeMsg = {
          time: currentTime,
          event: "chat",
          user: actualNickname,
          message: `Notice to ${targetUser}: ${noticeMessage}`,
          new_nick: null,
          email: null,
          channel: null
        };
        setChannelChatData(prev => ({
          ...prev,
          [activeWindow]: [
            ...(prev[activeWindow] || []),
            noticeMsg
          ]
        }));
        return;
      }

      // Handle /ignore command
      if (command === '/ignore' && args) {
        const targetUser = args.trim();
        const currentTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
        const ignoreMessage = {
          time: currentTime,
          event: "chat",
          user: actualNickname,
          message: `Added ${targetUser} to ignore list`,
          new_nick: null,
          email: null,
          channel: null
        };
        setChannelChatData(prev => ({
          ...prev,
          [activeWindow]: [
            ...(prev[activeWindow] || []),
            ignoreMessage
          ]
        }));
        return;
      }
    }

    const currentTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    const newMessage = {
      time: currentTime,
      event: "chat",
      user: actualNickname,
      message: message,
      new_nick: null,
      email: null,
      channel: null
    };

    // Add message to the current channel's data
    setChannelChatData(prev => ({
      ...prev,
      [activeWindow]: [
        ...(prev[activeWindow] || []),
        newMessage
      ]
    }));

    // Auto-scroll to bottom
    setTimeout(() => {
      const chatContainer = document.querySelector('.chats');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  };

  // Handle opening chat window for a user
  const handleOpenChatWindow = (user: string) => {
    console.log('handleOpenChatWindow called with user:', user);
    console.log('Current activeWindow:', activeWindow);

    // Add user to chatUsers if not already present
    if (!chatUsers.includes(user)) {
      setChatUsers(prev => [...prev, user]);
      console.log('Added user to chatUsers:', user);
    }

    // Switch to the user's chat window
    setActiveWindow(user);
    console.log('Set activeWindow to:', user);
  };

  // Handle context menu actions for private chat tabs
  const handleChatTabContextAction = (action: string, user?: string) => {
    console.log('Chat tab context action:', action, user);
    setChatTabContextMenu({ visible: false, x: 0, y: 0, user: '' });

    if (!user) return;

    switch (action) {
      case 'clear':
        // Clear chat messages for this user
        if (setChannelChatData) {
          setChannelChatData(prev => ({
            ...prev,
            [user]: []
          }));
        }
        break;
      case 'whois':
        // Show whois info - only if connected
        if (!connected) {
          console.log('Whois only works when connected to server');
          break;
        }

        // Check rate limiting: 30 seconds between whois requests per user
        const lastWhoisTime = lastWhoisTimeRef.current.get(user);
        const now = Date.now();
        const thirtySeconds = 30 * 1000;

        if (lastWhoisTime && (now - lastWhoisTime) < thirtySeconds) {
          const remainingSeconds = Math.ceil((thirtySeconds - (now - lastWhoisTime)) / 1000);
          console.log(`Whois rate limit: Please wait ${remainingSeconds} more seconds`);

          // Show rate limit message in chat (plain text, no timestamp or user prefix)
          if (setChannelChatData) {
            const rateLimitMessage = {
              event: "system",
              message: `Whois rate limit: Please wait ${remainingSeconds} more second${remainingSeconds > 1 ? 's' : ''} before requesting whois again.`,
              user: user,
              new_nick: null,
              email: null,
              channel: null
            };

            setChannelChatData(prev => ({
              ...prev,
              [user]: [
                ...(prev[user] || []),
                rateLimitMessage
              ]
            }));
          }
          break;
        }

        // Update last whois time for this user
        lastWhoisTimeRef.current.set(user, now);

        // Switch to the user's chat window first if not already active
        if (activeWindow !== user) {
          setActiveWindow(user);
        }

        // Generate and add whois messages directly
        const userChannels = getUserChannels(user, channelUserManagement, channelChatData);
        const info = generateWhoisInfo(user, userChannels);
        const separator = '~'.repeat(30);

        const whoisMessages = [
          {
            event: "whois",
            message: separator,
            user: user,
            new_nick: null,
            email: null,
            channel: null,
            whoisData: info,
            isSeparator: true
          },
          {
            event: "whois",
            message: `Nick: ${info.nick}`,
            user: user,
            new_nick: null,
            email: null,
            channel: null,
            whoisData: info
          },
          {
            event: "whois",
            message: `IP: ${info.ip}`,
            user: user,
            new_nick: null,
            email: null,
            channel: null,
            whoisData: info
          },
          {
            event: "whois",
            message: `İsim: ${info.isim}`,
            user: user,
            new_nick: null,
            email: null,
            channel: null,
            whoisData: info
          },
          {
            event: "whois",
            message: `Rumuz Bilgi: ${info.rumuzBilgi}`,
            user: user,
            new_nick: null,
            email: null,
            channel: null,
            whoisData: info
          },
          {
            event: "whois",
            message: `Kanallar: ${info.kanallar.length > 0 ? info.kanallar.join(' ') : 'Yok'}`,
            user: user,
            new_nick: null,
            email: null,
            channel: null,
            whoisData: info
          },
          {
            event: "whois",
            message: `Server: ${info.server}`,
            user: user,
            new_nick: null,
            email: null,
            channel: null,
            whoisData: info
          },
          {
            event: "whois",
            message: separator,
            user: user,
            new_nick: null,
            email: null,
            channel: null,
            whoisData: info,
            isSeparator: true
          }
        ];

        // Add whois messages to the chat
        setChannelChatData(prev => ({
          ...prev,
          [user]: [
            ...(prev[user] || []),
            ...whoisMessages
          ]
        }));

        // Auto-scroll to bottom
        setTimeout(() => {
          const chatContainer = document.querySelector('.chats');
          if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
        }, 100);
        break;
      case 'ping':
        // Send ping command
        handleSendMessage(`/ping ${user}`);
        break;
      case 'notice':
        // Send notice command
        handleSendMessage(`/notice ${user} `);
        break;
      case 'ignore':
        // Ignore user
        handleSendMessage(`/ignore ${user}`);
        break;
      case 'copy':
        // Copy user name
        if (navigator.clipboard) {
          navigator.clipboard.writeText(user);
        }
        break;
      case 'find':
        // Find dialog (could be implemented later)
        console.log('Find dialog for user:', user);
        break;
      case 'close':
        // Close chat window - remove user from chatUsers (but keep chat data)
        setChatUsers(prev => prev.filter(u => u !== user));
        // If this was the active window, switch to console or first channel
        if (activeWindow === user) {
          if (channels.length > 0) {
            setActiveWindow(`#${channels[0]}`);
          } else {
            setActiveWindow(null);
          }
        }
        // Don't clear chat data - keep messages for when user reopens the chat
        break;
      case 'desktop':
        // Desktop action (placeholder for window management)
        console.log('Desktop action for:', user);
        break;
      case 'ontop':
        // On Top action (placeholder for window management)
        console.log('On Top action for:', user);
        break;
      case 'background':
      case 'buffer':
      case 'logging':
      case 'position':
      case 'spacing':
      case 'timestamp':
        // Settings submenu actions (placeholders)
        console.log(`${action} action for:`, user);
        break;
      case 'font':
        // Font dialog (placeholder)
        console.log('Font dialog for:', user);
        break;
      case 'beeping':
      case 'flashing':
      case 'trackurls':
        // Toggle settings (placeholders)
        console.log(`${action} toggle for:`, user);
        break;
      case 'restore':
        // Restore window (placeholder)
        console.log('Restore window for:', user);
        break;
      case 'minimize':
        // Minimize window (placeholder)
        console.log('Minimize window for:', user);
        break;
      case 'maximize':
        // Maximize window (placeholder)
        console.log('Maximize window for:', user);
        break;
      case 'next':
        // Switch to next tab
        const allTabs = [...channels.map(c => `#${c}`), ...chatUsers];
        const currentIndex = allTabs.indexOf(user);
        if (currentIndex !== -1 && currentIndex < allTabs.length - 1) {
          setActiveWindow(allTabs[currentIndex + 1]);
        } else if (allTabs.length > 0) {
          setActiveWindow(allTabs[0]);
        }
        break;
    }
  };

  // Handle context menu actions for channel tabs
  const handleChannelTabContextAction = (action: string, channel?: string) => {
    console.log('Channel tab context action:', action, channel);
    setChannelTabContextMenu({ visible: false, x: 0, y: 0, channel: '' });

    if (!channel) return;

    const channelName = channel.startsWith('#') ? channel : `#${channel}`;

    switch (action) {
      case 'clear':
        // Clear channel messages
        if (setChannelChatData) {
          setChannelChatData(prev => ({
            ...prev,
            [channelName]: []
          }));
        }
        break;
      case 'close':
        // Add leave message before closing
        if (setChannelChatData && connected) {
          const host = generateHostForNickname(actualNickname);
          const currentTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
          const leaveMessage = {
            time: currentTime,
            event: "quit",
            user: actualNickname,
            message: `*** Cikis: ${actualNickname} (${host}) ${channelName}`,
            new_nick: null,
            email: host, // Use host as email field for display
            channel: channelName
          };

          setChannelChatData(prev => ({
            ...prev,
            [channelName]: [
              ...(prev[channelName] || []),
              leaveMessage
            ]
          }));
        }

        // Remove current user from channel user management chatUsers when leaving
        setChannelUserManagement(prev => {
          const currentManagement = prev[channelName];
          if (currentManagement) {
            return {
              ...prev,
              [channelName]: {
                ...currentManagement,
                chatUsers: currentManagement.chatUsers.filter(u => u.nick !== actualNickname)
              }
            };
          }
          return prev;
        });

        // Close channel tab - remove from channels list (but keep chat data)
        setChannels(prev => prev.filter(c => `#${c}` !== channelName));
        // If this was the active window, switch to console or another channel
        if (activeWindow === channelName) {
          const remainingChannels = channels.filter(c => `#${c}` !== channelName);
          if (remainingChannels.length > 0) {
            setActiveWindow(`#${remainingChannels[0]}`);
          } else {
            setActiveWindow(null);
          }
        }
        // Don't clear chat data - keep messages for when user rejoins
        break;
      case 'join':
        // Join channel dialog (could be implemented later)
        console.log('Join channel dialog');
        break;
      case 'part':
        // Add leave message before parting
        if (setChannelChatData && connected) {
          const host = generateHostForNickname(actualNickname);
          const currentTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
          const leaveMessage = {
            time: currentTime,
            event: "quit",
            user: actualNickname,
            message: `*** Cikis: ${actualNickname} (${host}) ${channelName}`,
            new_nick: null,
            email: host, // Use host as email field for display
            channel: channelName
          };

          setChannelChatData(prev => ({
            ...prev,
            [channelName]: [
              ...(prev[channelName] || []),
              leaveMessage
            ]
          }));
        }

        // Remove current user from channel user management chatUsers when leaving
        setChannelUserManagement(prev => {
          const currentManagement = prev[channelName];
          if (currentManagement) {
            return {
              ...prev,
              [channelName]: {
                ...currentManagement,
                chatUsers: currentManagement.chatUsers.filter(u => u.nick !== actualNickname)
              }
            };
          }
          return prev;
        });

        // Part from channel - remove from channels list
        setChannels(prev => prev.filter(c => `#${c}` !== channelName));
        // If this was the active window, switch to console or another channel
        if (activeWindow === channelName) {
          const remainingChannels = channels.filter(c => `#${c}` !== channelName);
          if (remainingChannels.length > 0) {
            setActiveWindow(`#${remainingChannels[0]}`);
          } else {
            setActiveWindow(null);
          }
        }
        // Don't clear chat data - keep messages for when user rejoins
        break;
      case 'topic':
        // Edit channel topic (could be implemented later)
        console.log('Edit channel topic:', channelName);
        break;
      case 'mode':
        // Edit channel mode (could be implemented later)
        console.log('Edit channel mode:', channelName);
        break;
      case 'banlist':
        // View ban list (could be implemented later)
        console.log('View ban list:', channelName);
        break;
      case 'copy':
        // Copy channel name
        if (navigator.clipboard) {
          navigator.clipboard.writeText(channelName);
        }
        break;
      case 'find':
        // Find dialog (could be implemented later)
        console.log('Find dialog for channel:', channelName);
        break;
      case 'ignore':
        // Ignore list (could be implemented later)
        console.log('Ignore list');
        break;
    }
  };

  // Handle selecting a nickname in the user list (without opening chat)
  const handleSelectNickname = (nickname: string) => {
    // Find the nickname in the current channel's user list and select it
    if (!activeWindow || !activeWindow.startsWith('#')) {
      return; // Only work for channels
    }

    const channelUsers = channelUserManagement[activeWindow];
    if (!channelUsers) return;

    // Always include the current user and special users (same as List component)
    const allChannelUsers = getAllChannelUsers(channelUsers, actualNickname);

    // Sort users by priority & alphabetically (same as List component)
    const sortedUsers = [...allChannelUsers].sort((a, b) => {
      const priorityA = opPriority[a.op] || 99;
      const priorityB = opPriority[b.op] || 99;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return a.nick.localeCompare(b.nick);
    });

    // Find the index of the clicked nickname (case-insensitive, ignore op prefixes)
    const clickedNickname = nickname.replace(/^[~&@%+]/, '').toLowerCase();
    const index = sortedUsers.findIndex(user => {
      const userNick = user.nick.replace(/^[~&@%+]/, '').toLowerCase();
      return userNick === clickedNickname;
    });

    if (index !== -1) {
      setSelected(index);
    }
  };

  // Handle list resizing
  React.useEffect(() => {
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('list-resize-handle')) {
        isResizing = true;
        startX = e.clientX;
        startWidth = listWidth;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = startX - e.clientX; // Inverted for left expansion
      const newWidth = Math.max(150, Math.min(400, startWidth + deltaX));
      setListWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    // Add event listeners with capture to ensure they fire first
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('mouseup', handleMouseUp, true);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('mouseup', handleMouseUp, true);
    };
  }, [listWidth]);

  // Handle menu item clicks
  const handleMenuItemClick = (menu: string, submenu: string) => {
    console.log(`Menu clicked: ${menu} -> ${submenu}`);

    // Handle specific menu actions
    switch (`${menu}-${submenu}`) {
      case 'File-New':
        handleSendMessage('/new');
        break;
      case 'File-Open':
        handleSendMessage('/open');
        break;
      case 'File-Save':
        handleSendMessage('/save');
        break;
      case 'View-Zoom In':
        // Could implement zoom functionality
        break;
      case 'View-Zoom Out':
        // Could implement zoom functionality
        break;
      case 'PAPATYA Script v7 e-mIRC-About':
        handleSendMessage('/about');
        break;
      case 'PAPATYA Script v7 e-mIRC-Help':
        handleSendMessage('/help');
        break;
      case 'Help-Documentation':
        handleSendMessage('/doc');
        break;
      case 'Help-Support':
        handleSendMessage('/support');
        break;
      default:
        handleSendMessage(`/${submenu.toLowerCase().replace(' ', '')}`);
    }
  };

  return (
    <div>

      <MenuBar onMenuItemClick={handleMenuItemClick} />

      <Toolbar
        connected={connected}
        setConnected={setConnected}
      />

      <div className="main">

        {/* Chat Window */}
        <div className="chat-window">
          <div className="chat-container">
            <div className="chats">
              <Console
                activeWindow={activeWindow}
                connected={connected}
                currentUser={actualNickname}
                isLoading={isLoading}
                channelChatData={channelChatData}
                setChannelChatData={setChannelChatData}
                channelLoadingComplete={channelLoadingComplete}
                setChannelLoadingComplete={setChannelLoadingComplete}
                loadingMessages={loadingMessages}
                setLoadingMessages={setLoadingMessages}
                loadingComplete={loadingComplete}
                setLoadingComplete={setLoadingComplete}
                onNicknameClick={handleOpenChatWindow}
                onNicknameSelect={handleSelectNickname}
                channelUserManagement={channelUserManagement}
                chatScrollPositionsRef={chatScrollPositionsRef}
                onPeerDoubleClick={(user) => {
                  // This will be handled by Peer component's own double-click handler
                  console.log('Peer double-click from Console:', user);
                }}
                onCloseChat={(user) => {
                  // Close chat tab without clearing messages
                  setChatUsers(prev => prev.filter(u => u !== user));
                  // If this was the active window, switch to console or first channel
                  if (activeWindow === user) {
                    if (channels.length > 0) {
                      setActiveWindow(`#${channels[0]}`);
                    } else {
                      setActiveWindow(null);
                    }
                  }
                }}
                onOpenChannel={(channelName) => {
                  // Open/switch to channel when double-clicked in whois
                  // Remove '#' if present, then add it back (normalize)
                  const channelWithoutHash = channelName.startsWith('#') ? channelName.slice(1) : channelName;
                  const normalizedChannel = `#${channelWithoutHash}`;

                  // Add channel to channels list if not already present
                  if (!channels.includes(normalizedChannel)) {
                    setChannels(prev => [...prev, normalizedChannel]);
                  }

                  // Switch to the channel
                  setActiveWindow(normalizedChannel);
                }}
              />
            </div>
          </div>
        </div>


        {/* List - Hide when console is active OR when viewing private chat */}
        {activeWindow && activeWindow.startsWith('#') && (
          <div className="list" style={{ width: `${listWidth}px` }}>
            <div className="list-resize-handle"></div>
            <React.Suspense fallback={null}>
              <List
                hideComponent={!connected}
                selected={selected}
                setSelected={setSelected}
                chatUsers={chatUsers}
                setChatUsers={setChatUsers}
                nickname={actualNickname}
                onSendMessage={handleSendMessage}
                onOpenChatWindow={handleOpenChatWindow}
                activeWindow={activeWindow}
                channelChatData={channelChatData[activeWindow] || []}
                channelUserManagement={channelUserManagement[activeWindow]}
              />
            </React.Suspense>
          </div>
        )}



        {/* Channels */}
        <div
          className="channels"
          style={{
            backgroundImage: `url(${SideBg})`,
            backgroundSize: 'cover',
          }}
        >

          {/* Console */}
          <div
            className={`channel-item ${!activeWindow ? 'active' : ''}`}
            onClick={() => setActiveWindow(null)}
          >
            <img src={BarIcon} className='channel-icon' />
            <span className="channel-text">
              {config.server_name}
            </span>
          </div>

          {/* Channels */}
          {connected && channels.map((channel, index) => {
            const channelName = `#${channel}`;
            const messages = channelChatData[channelName] || [];
            const hasUnseen = activeWindow !== channelName && hasUnseenMessages(channelName, messages);
            
            return (
              <div
                key={index}
                className={`channel-item ${activeWindow === channelName ? 'active' : ''}`}
                onClick={(e) => {
                  // Shift + Left Click: Close channel
                  if (e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleChannelTabContextAction('close', channelName);
                  } else {
                    setActiveWindow(channelName);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setChannelTabContextMenu({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    channel: channelName
                  });
                }}
              >
                <img src={ChannelItemIcon} className='channel-icon' />
                <span className={`channel-text ${hasUnseen ? 'unseen-messages' : ''}`}>
                  #{channel}
                </span>
              </div>
            )
          })}

          {/* Users */}
          {chatUsers.map((user, index) => {
            const messages = channelChatData[user] || [];
            const hasUnseen = activeWindow !== user && hasUnseenMessages(user, messages);
            
            return (
              <div
                key={index}
                className={`channel-item ${activeWindow === user ? 'active' : ''}`}
                onClick={(e) => {
                  // Shift + Left Click: Close private chat
                  if (e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleChatTabContextAction('close', user);
                  } else {
                    setActiveWindow(user);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setChatTabContextMenu({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    user: user
                  });
                }}
              >
                <img src={ListItemIcon} className='channel-icon' />
                <span className={`channel-text ${hasUnseen ? 'unseen-messages' : ''}`}>
                  {user}
                </span>
              </div>
            );
          })}



        </div>


      </div> {/* Main */}

      <React.Suspense fallback={null}>
        <ChatInput
          onSendMessage={handleSendMessage}
          currentChannel={activeWindow || undefined}
          currentUser={actualNickname}
        />
      </React.Suspense>

      {/* Context Menu for Private Chat Tabs */}
      <React.Suspense fallback={null}>
        <ContextMenu
          visible={chatTabContextMenu.visible}
          x={chatTabContextMenu.x}
          y={chatTabContextMenu.y}
          items={getPeerTabContextMenuItems(chatTabContextMenu.user, handleChatTabContextAction)}
          onClose={() => setChatTabContextMenu({ visible: false, x: 0, y: 0, user: '' })}
          minWidth={220}
        />
      </React.Suspense>

      {/* Context Menu for Channel Tabs */}
      <React.Suspense fallback={null}>
        <ContextMenu
          visible={channelTabContextMenu.visible}
          x={channelTabContextMenu.x}
          y={channelTabContextMenu.y}
          items={getChannelContextMenuItems(channelTabContextMenu.channel, handleChannelTabContextAction)}
          onClose={() => setChannelTabContextMenu({ visible: false, x: 0, y: 0, channel: '' })}
          minWidth={220}
        />
      </React.Suspense>

      {/* Context Menu for Channel Tabs */}
      <React.Suspense fallback={null}>
        <ContextMenu
          visible={channelTabContextMenu.visible}
          x={channelTabContextMenu.x}
          y={channelTabContextMenu.y}
          items={getChannelContextMenuItems(channelTabContextMenu.channel, handleChannelTabContextAction)}
          onClose={() => setChannelTabContextMenu({ visible: false, x: 0, y: 0, channel: '' })}
          minWidth={220}
        />
      </React.Suspense>

    </div>
  );
};

export default React.memo(Emirc);