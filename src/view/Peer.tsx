import React from 'react'

// Components
const ContextMenu = React.lazy(() => import('../components/ContextMenu'));

// Utils
import { getPeerContextMenuItems } from '../utils/contextMenuConfigs';
import { generateWhoisInfo, getUserChannels, type WhoisInfo } from '../utils/whoisUtils';

// Assets
import BluestarImage from '../assets/bluestar.png';

type Props = {
  connected: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  userScrolledUp: React.RefObject<boolean>;
  currentUser?: string;
  peerUser?: string;
  peerChatData: Array<any>;
  channelUserManagement?: Record<string, any>;
  channelChatData?: Record<string, Array<any>>;
  setChannelChatData?: React.Dispatch<React.SetStateAction<Record<string, Array<any>>>>;
  onDoubleClick?: React.MutableRefObject<(() => void) | null>;
  onCloseChat?: (user: string) => void;
  onOpenChannel?: (channelName: string) => void;
  isRestoringScroll?: boolean;
}

const Peer = (props: Props) => {
  const { connected, chatContainerRef, userScrolledUp, currentUser, peerUser, peerChatData, channelUserManagement, channelChatData, setChannelChatData, onCloseChat, onOpenChannel, isRestoringScroll } = props;

  // Context menu state
  const [contextMenu, setContextMenu] = React.useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0
  });

  // Track last whois time per user (rate limiting: 30 seconds)
  const lastWhoisTimeRef = React.useRef<Map<string, number>>(new Map());

  // Use peer-specific chat data
  const allMessages = React.useMemo(() => {
    return peerChatData;
  }, [peerChatData]);

  // Prevent default browser context menu - attach to the actual chats container
  React.useEffect(() => {
    // Use the chatContainerRef passed from parent (the actual .chats div)
    const chatsContainer = chatContainerRef.current;
    if (!chatsContainer) return;

    const handleNativeContextMenu = (e: MouseEvent) => {
      // Only handle if this is a private chat window
      if (!peerUser) return;

      const target = e.target as HTMLElement;
      const isChatItem = target.closest('.chat-item');

      // Always prevent browser's default context menu
      e.preventDefault();
      e.stopImmediatePropagation();

      // Only show custom menu if not clicking on chat item
      if (!isChatItem) {
        setContextMenu({
          visible: true,
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    // Use capture phase to catch event early - attach to the chats container
    chatsContainer.addEventListener('contextmenu', handleNativeContextMenu, true);

    return () => {
      chatsContainer.removeEventListener('contextmenu', handleNativeContextMenu, true);
    };
  }, [peerUser, chatContainerRef]);

  // Handle right-click context menu (only on chat body/background, not on messages)
  const handleContextMenu = (e: React.MouseEvent) => {
    // Always prevent default browser context menu
    e.preventDefault();
    e.stopPropagation();

    // Only show context menu if clicking on the chat body/background area
    // Not on chat messages or other nested elements
    const target = e.target as HTMLElement;

    // Check if clicking on or inside a chat-item (message)
    const isChatItem = target.closest('.chat-item');

    // Don't show context menu if clicking on a chat message item
    // But we still prevent default browser menu above
    if (isChatItem) {
      return;
    }

    // Only show context menu when clicking directly on the background/body area
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  // Function to add whois info as chat messages
  const showWhois = React.useCallback(() => {
    console.log('showWhois called, peerUser:', peerUser, 'connected:', connected);

    // Only allow whois if connected to server
    if (!connected) {
      console.log('Whois only works when connected to server');
      return;
    }

    if (!peerUser) {
      return;
    }

    // Check rate limiting: 30 seconds between whois requests per user (skip in development)
    const isDevelopment = import.meta.env.DEV;

    if (!isDevelopment) {
      const lastWhoisTime = lastWhoisTimeRef.current.get(peerUser);
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
            user: peerUser,
            new_nick: null,
            email: null,
            channel: null
          };

          setChannelChatData(prev => ({
            ...prev,
            [peerUser]: [
              ...(prev[peerUser] || []),
              rateLimitMessage
            ]
          }));
        }
        return;
      }

      // Update last whois time for this user (only in production)
      lastWhoisTimeRef.current.set(peerUser, now);
    }

    if (setChannelChatData) {
      console.log('Generating whois info for:', peerUser);
      const userChannels = getUserChannels(peerUser, channelUserManagement, channelChatData);
      console.log('User channels:', userChannels);
      const info = generateWhoisInfo(peerUser, userChannels);
      console.log('Whois info generated:', info);

      // Add whois messages to chat data (no timestamp for whois)
      const separator = '~'.repeat(30);
      const whoisMessages = [
        {
          event: "whois",
          message: separator,
          user: peerUser,
          new_nick: null,
          email: null,
          channel: null,
          whoisData: info,
          isSeparator: true
        },
        {
          event: "whois",
          message: `Nick: ${info.nick}`,
          user: peerUser,
          new_nick: null,
          email: null,
          channel: null,
          whoisData: info
        },
        {
          event: "whois",
          message: `IP: ${info.ip}`,
          user: peerUser,
          new_nick: null,
          email: null,
          channel: null,
          whoisData: info
        },
        {
          event: "whois",
          message: `İsim: ${info.isim}`,
          user: peerUser,
          new_nick: null,
          email: null,
          channel: null,
          whoisData: info
        },
        {
          event: "whois",
          message: `Rumuz Bilgi: ${info.rumuzBilgi}`,
          user: peerUser,
          new_nick: null,
          email: null,
          channel: null,
          whoisData: info
        },
        {
          event: "whois",
          message: `Kanallar: ${info.kanallar.length > 0 ? info.kanallar.join(' ') : 'Yok'}`,
          user: peerUser,
          new_nick: null,
          email: null,
          channel: null,
          whoisData: info
        },
        {
          event: "whois",
          message: `Server: ${info.server}`,
          user: peerUser,
          new_nick: null,
          email: null,
          channel: null,
          whoisData: info
        },
        ...(peerUser?.toLowerCase() === 'bluestar' ? [{
          event: "whois" as const,
          message: `IRCop: bLueStar is an IRC Operator & Root Administrator`,
          user: peerUser,
          new_nick: null,
          email: null,
          channel: null,
          whoisData: info
        }] : []),
        {
          event: "whois",
          message: separator,
          user: peerUser,
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
        [peerUser]: [
          ...(prev[peerUser] || []),
          ...whoisMessages
        ]
      }));

      // Auto-scroll to bottom
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);

      console.log('Whois messages added to chat');
    } else {
      console.log('No peerUser or setChannelChatData found');
    }
  }, [peerUser, channelUserManagement, channelChatData, setChannelChatData, chatContainerRef, connected]);

  // Expose showWhois to parent via ref
  React.useEffect(() => {
    if (props.onDoubleClick) {
      props.onDoubleClick.current = showWhois;
    }
    return () => {
      if (props.onDoubleClick) {
        props.onDoubleClick.current = null;
      }
    };
  }, [props.onDoubleClick, showWhois]);

  // Handle double-click on chat body to show whois
  const handleDoubleClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      // Prevent text selection on double click
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }
    }
    console.log('Double-click detected in Peer component');
    showWhois();
  };

  // Prevent text selection on double click
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent text selection on double click
    if (e.detail > 1) {
      e.preventDefault();
    }
  };


  // Handle context menu actions
  const handleContextAction = (action: string, user?: string) => {
    console.log('Peer context action:', action, user);
    // Implement actions here
    switch (action) {
      case 'clear':
        // Clear chat messages for this private chat
        if (peerUser && setChannelChatData) {
          setChannelChatData(prev => ({
            ...prev,
            [peerUser]: []
          }));
        }
        break;
      case 'whois':
      case 'whois_cek':
        // Who is user
        showWhois();
        break;
      case 'ping':
      case 'ping_yolla':
        // Ping user (placeholder)
        console.log('Ping user:', peerUser);
        break;
      case 'nickinfo':
      case 'nick_infosu':
        // Nick info (placeholder)
        console.log('Nick info for:', peerUser);
        break;
      case 'dupman':
      case 'dupman_listesi':
        // Düpman listesi (placeholder)
        console.log('Düpman listesi for:', peerUser);
        break;
      case 'dcc':
        // DCC action (placeholder)
        console.log('DCC for:', peerUser);
        break;
      case 'ignore':
      case 'ignore_engelle':
        // Ignore user (placeholder)
        console.log('Ignore user:', peerUser);
        break;
      case 'notify':
        // Notify action (placeholder)
        console.log('Notify for:', peerUser);
        break;
      case 'op':
      case 'op_islemleri':
        // Op operations (placeholder)
        console.log('Op operations for:', peerUser);
        break;
      case 'log':
      case 'log_tut':
        // Log action (placeholder)
        console.log('Log for:', peerUser);
        break;
      case 'eglence':
      case 'eglence_edebiyat':
        // Eğlence/Edebiyat (placeholder)
        console.log('Eğlence/Edebiyat for:', peerUser);
        break;
      case 'diger':
      case 'diger_islemler':
        // Other operations (placeholder)
        console.log('Other operations for:', peerUser);
        break;
      case 'webcam':
      case 'web_kamerasi':
        // Web camera (placeholder)
        console.log('Web camera for:', peerUser);
        break;
      case 'close':
        // Close chat window - call parent callback to close tab without clearing messages
        if (peerUser && onCloseChat) {
          onCloseChat(peerUser);
        }
        break;
    }
  };

  // Check if we should show bluestar image (only for bLueStar's chat, and current user is NOT bLueStar)
  const shouldShowBluestarImage = peerUser?.toLowerCase() === 'bluestar' &&
    currentUser?.toLowerCase() !== 'bluestar';

  // Debug logging
  React.useEffect(() => {
    if (peerUser) {
      console.log('Peer component - peerUser:', peerUser, 'currentUser:', currentUser);
      console.log('Should show bluestar image:', shouldShowBluestarImage);
    }
  }, [peerUser, currentUser, shouldShowBluestarImage]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          cursor: "default",
          minHeight: "100%",
          height: "100%",
          width: "100%",
          userSelect: "none",
          WebkitUserSelect: "none",
          position: "relative",
          overflow: "hidden"
        }}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
      >
        {/* Bluestar image overlay - centered, covering entire window height */}
        {shouldShowBluestarImage && (
          <div
            style={{
              position: "fixed",
              top: "85px", // Start below menu bar (20px) + toolbar (~65px) = 85px
              left: 0,
              right: 0,
              bottom: 0,
              height: "calc(100vh - 85px)", // Full window height minus menu/toolbar
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 0,
              pointerEvents: "none",
              width: "100%"
            }}
          >
            <img
              src={BluestarImage}
              alt="bLueStar"
              style={{
                width: "70%",
                height: "70%",
                minWidth: "300px",
                minHeight: "300px",
                maxWidth: "85%",
                maxHeight: "85%",
                objectFit: "contain",
                opacity: 0.4,
                display: "block",
                flexShrink: 0
              }}
              onError={(e) => {
                console.error('Failed to load bluestar.png image');
                const img = e.target as HTMLImageElement;
                console.log('Image src:', img.src);
                console.log('Protocol:', window.location.protocol);
                console.log('Full URL:', window.location.href);
              }}
              onLoad={() => {
                console.log('Bluestar image loaded successfully!');
                const img = document.querySelector('img[alt="bLueStar"]') as HTMLImageElement;
                if (img) {
                  console.log('Final image src:', img.src);
                  console.log('Image dimensions:', img.naturalWidth, 'x', img.naturalHeight);
                  console.log('Image display dimensions:', img.offsetWidth, 'x', img.offsetHeight);
                }
              }}
            />
          </div>
        )}
        <div
          style={{
            marginTop: "auto",
            minHeight: "100%",
            userSelect: "none",
            WebkitUserSelect: "none",
            position: "relative",
            zIndex: 2
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            handleDoubleClick(e);
          }}
          onMouseDown={handleMouseDown}
          onContextMenu={(e) => {
            // Also prevent default on the inner container
            e.preventDefault();
            e.stopPropagation();
            handleContextMenu(e);
          }}
        >
        {allMessages.map((chat, index) => {
          const { time, event, message, user, whoisData, isSeparator } = chat;
          const isCurrentUser = currentUser && user === currentUser;

          let row: React.ReactElement | null = null;

          if (event === "whois") {
            // Handle separator lines
            if (isSeparator || message.startsWith('~'.repeat(10))) {
              row = (
                <span style={{ color: '#ddd' }}>{message}</span>
              );
            } else {
              // Format whois messages with ~ prefix (no timestamp)
              const parts = message.split(':');
              const label = parts[0].trim();
              const value = parts.slice(1).join(':').trim();

              row = (
                <span>
                  <span style={{ color: '#000' }}>~</span>{' '}
                  <span style={{ color: '#313087', fontWeight: 'bold' }}>{label}:</span>{' '}
                  {label === 'Nick' && (
                    <span style={{ color: '#ff0000' }}>{value}</span>
                  )}
                  {label === 'Server' && (
                    <span style={{ color: '#000' }}>{value}</span>
                  )}
                  {label === 'IRCop' && (
                    <span style={{ color: '#000' }}>{value}</span>
                  )}
                  {label === 'Kanallar' && (
                    <span style={{ color: '#000' }}>
                      {value === 'Yok' ? (
                        value
                      ) : (
                        value.split(' ').map((channel: string, idx: number) => {
                          const channelName = channel.trim();
                          if (!channelName) return null;
                          return (
                            <React.Fragment key={idx}>
                              {idx > 0 && ' '}
                              <span
                                style={{
                                  color: '#000',
                                  cursor: 'pointer',
                                  userSelect: 'text',
                                  WebkitUserSelect: 'text'
                                }}
                                onDoubleClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (onOpenChannel && channelName) {
                                    onOpenChannel(channelName);
                                  }
                                }}
                                title="Double-click to open channel"
                              >
                                {channelName}
                              </span>
                            </React.Fragment>
                          );
                        })
                      )}
                    </span>
                  )}
                  {(label !== 'Nick' && label !== 'Server' && label !== 'IRCop' && label !== 'Kanallar') && (
                    <span style={{ color: '#000' }}>{value}</span>
                  )}
                </span>
              );
            }
          } else if (event === "chat") {
            row = (
              <span>
                <span
                  style={{
                    color: isCurrentUser ? "#0066cc" : "#7e0505",
                    fontWeight: "normal"
                  }}
                >
                  {`<${user}>`}
                </span>
                : {message}
              </span>
            );
          } else if (event === "system") {
            // System messages - plain text, no timestamp or user prefix
            row = (
              <span style={{ color: '#000' }}>{message}</span>
            );
          }

          return (
            <div
              key={`${index}-${user}-${event}-${message}`}
              className="chat-item"
              onContextMenu={(e) => {
                // Always prevent default browser context menu on chat items
                e.preventDefault();
                e.stopPropagation();
                // Don't show custom menu on messages
              }}
            >
              {/* Only show timestamp for non-whois and non-system messages */}
              {event !== "whois" && event !== "system" && time && (
                <span className="chat-time pe-1">[{time}]</span>
              )}
              {row}
            </div>
          );
        })}
        </div>
      </div>

      {/* Context Menu */}
      <React.Suspense fallback={null}>
        <ContextMenu
          visible={contextMenu.visible}
          x={contextMenu.x}
          y={contextMenu.y}
          items={getPeerContextMenuItems(peerUser || '', handleContextAction)}
          onClose={() => setContextMenu({ visible: false, x: 0, y: 0 })}
          minWidth={220}
        />
      </React.Suspense>

    </>
  )
}

export default React.memo(Peer);