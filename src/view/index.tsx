import React from 'react';

// Consts
import { config, chats, papatyaChats, webcamChats } from '../const';
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

// ==============================================================================================


const Emirc = ({ nickname }: { nickname: string }) => {

  // States
  const [connected, setConnected] = React.useState(false);
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

        // Add channel to the list
        setChannels(prev => [...prev, channelToJoin]);

        // Play join sound
        const joinAudio = new Audio(JoinedWAV);
        joinAudio.volume = 0.6;
        joinAudio.play();

        // Set first channel as active window
        if (channelIndex === 0) {
          setActiveWindow(`#${channelToJoin}`);
        }
      }, delay);

      return () => clearTimeout(timer);
    } else if (joiningChannels && channels.length === config.channels.length) {
      setJoiningChannels(false);
    }
  }, [joiningChannels, channels]);

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

    const currentTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    const newMessage = {
      time: currentTime,
      event: "chat",
      user: nickname,
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

  // Handle selecting a nickname in the user list (without opening chat)
  const handleSelectNickname = (user: string) => {
    console.log('handleSelectNickname called with user:', user);
    // This will be handled by the List component to highlight the user
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
                currentUser={nickname}
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
                nickname={nickname}
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
            return (
              <div
                key={index}
                className={`channel-item ${activeWindow === `#${channel}` ? 'active' : ''}`}
                onClick={() => setActiveWindow(`#${channel}`)}
              >
                <img src={ChannelItemIcon} className='channel-icon' />
                <span className="channel-text">
                  #{channel}
                </span>
              </div>
            )
          })}

          {/* Users */}
          {chatUsers.map((user, index) => (
            <div
              key={index}
              className={`channel-item ${activeWindow === user ? 'active' : ''}`}
              onClick={() => setActiveWindow(user)}
            >
              <img src={ListItemIcon} className='channel-icon' />
              <span className="channel-text">
                {user}
              </span>
            </div>
          ))}



        </div>


      </div> {/* Main */}

      <React.Suspense fallback={null}>
        <ChatInput
          onSendMessage={handleSendMessage}
          currentChannel={activeWindow || undefined}
          currentUser={nickname}
        />
      </React.Suspense>

    </div>
  );
};

export default React.memo(Emirc);