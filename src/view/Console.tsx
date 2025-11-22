import React from 'react'

// Consts
import { config, formatDate } from '../const';

// Components
const Channel = React.lazy(() => import('./Channel'));
const Peer = React.lazy(() => import('./Peer'));
const LoadingMock = React.lazy(() => import('../components/LoadingMock'));
const ContextMenu = React.lazy(() => import('../components/ContextMenu'));

// Utils
import { getConsoleContextMenuItems } from '../utils/contextMenuConfigs';
import { generateConnectionMessages, type ConnectionMessage } from '../utils/connectionMessages';

// ==============================================================================================

interface ConsoleProps {
  activeWindow: string | null;
  connected: boolean;
  currentUser?: string;
  isLoading?: boolean;
  channelChatData?: Record<string, Array<any>>;
  setChannelChatData?: React.Dispatch<React.SetStateAction<Record<string, Array<any>>>>;
  channelLoadingComplete?: Record<string, boolean>;
  setChannelLoadingComplete?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  loadingMessages?: Array<{ text: string, color: string }>;
  setLoadingMessages?: React.Dispatch<React.SetStateAction<Array<{ text: string, color: string }>>>;
  loadingComplete?: boolean;
  setLoadingComplete?: React.Dispatch<React.SetStateAction<boolean>>;
  onNicknameClick?: (nickname: string) => void;
  onNicknameSelect?: (nickname: string) => void;
  channelUserManagement?: Record<string, any>;
  onPeerDoubleClick?: (user: string, showWhois: () => void) => void;
  onCloseChat?: (user: string) => void;
  onOpenChannel?: (channelName: string) => void;
  chatScrollPositionsRef?: React.RefObject<Map<string, number>>;
}


const Console = (props: ConsoleProps) => {

  // Props
  const { activeWindow, connected, currentUser, isLoading, channelChatData, setChannelChatData, channelLoadingComplete, setChannelLoadingComplete, loadingMessages, setLoadingMessages, loadingComplete, setLoadingComplete, onNicknameClick, onNicknameSelect, onCloseChat, onOpenChannel, chatScrollPositionsRef } = props;

  // Refs
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const userScrolledUp = React.useRef(false);
  const previousActiveWindowRef = React.useRef<string | null>(null);
  const [isRestoringScroll, setIsRestoringScroll] = React.useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = React.useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0
  });

  // Cookie functions for tracking script runs
  const getScriptRunCount = (): number => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('papatya_script_runs='));
    if (cookie) {
      return parseInt(cookie.split('=')[1]) || 0;
    }
    return 0;
  };

  const incrementScriptRunCount = (): number => {
    const currentCount = getScriptRunCount();
    const newCount = currentCount + 1;
    // Set cookie with 10 year expiry
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 10);
    document.cookie = `papatya_script_runs=${newCount};expires=${expires.toUTCString()};path=/`;
    return newCount;
  };

  // Get or increment run count (only once per session)
  const [scriptRunCount] = React.useState(() => incrementScriptRunCount());

  // Opening:
  const badge = <div className='flex items-center'>
    <div style={{ width: 5, backgroundColor: '#d2d2d2' }}>&nbsp;</div>
    <div style={{ backgroundColor: '#fc1313', color: '#fff' }} className='px-1'>{config.script_name}</div>
    <div style={{ backgroundColor: '#000b7e', color: '#fff' }} className='px-1'>{config.script_version}</div>
    <div style={{ width: 5, backgroundColor: '#d2d2d2' }} className='me-1.5'>&nbsp;</div>
  </div>;

  const dashes = <div className='me-1'>
    <span style={{ color: '#ccc' }}>-</span>
    <span style={{ color: '#666' }}>-</span>
  </div>;

  const opening = [
    <div className='flex items-center'>  {dashes} {badge} Hoş Sohbetler Diler! </div>,
    <div className='flex items-center'> {dashes} Script şu ana kadar <span className="text-red-700 px-1 font-medium">{scriptRunCount}</span> kere çalıştırıldı! </div>,
    <div className='flex items-center'> {dashes} {formatDate(new Date())} </div>,
    <div className='flex items-center'> {dashes} Şu anki nickiniz: <span className="primary ps-1">{currentUser || config.root_nick}</span> </div>,
    <div className='flex items-center mb-1.5'> {dashes} Kısayol (F) tuşlarını öğrenmek için <span className="primary px-1">F12</span> tuşuna basınız. </div>,
  ];

  // Connection messages state
  const [connectionMessages, setConnectionMessages] = React.useState<ConnectionMessage[]>([]);
  const connectionMessagesInitialized = React.useRef(false);
  
  // Generate and display connection messages when connecting starts
  React.useEffect(() => {
    if (isLoading && !connected && !connectionMessagesInitialized.current && activeWindow === null) {
      // Generate connection messages
      const messages = generateConnectionMessages(
        currentUser || config.root_nick,
        config.server_name
      );
      
      // Clear any existing messages
      setConnectionMessages([]);
      connectionMessagesInitialized.current = true;
      
      // Display messages progressively over 3 seconds
      messages.forEach((msg, index) => {
        const delay = (index / messages.length) * 3000; // Spread over 3 seconds
        setTimeout(() => {
          setConnectionMessages(prev => [...prev, msg]);
        }, delay);
      });
    }
  }, [isLoading, connected, currentUser, activeWindow]);
  
  // Reset connection messages when disconnected
  React.useEffect(() => {
    if (!isLoading && !connected) {
      setConnectionMessages([]);
      connectionMessagesInitialized.current = false;
    }
  }, [isLoading, connected]);

  // Detects if user manually scrolls up
  const handleScroll = () => {
    if (chatContainerRef.current && !isRestoringScroll) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      userScrolledUp.current = scrollTop + clientHeight < scrollHeight - 20;
      
      // Save scroll position for current window
      if (activeWindow && chatScrollPositionsRef?.current) {
        chatScrollPositionsRef.current.set(activeWindow, scrollTop);
      }
    }
  };
  
  // Save scroll position before switching windows and restore when switching to a window
  React.useEffect(() => {
    // Save scroll position of previous window before switching
    if (previousActiveWindowRef.current && chatContainerRef.current && chatScrollPositionsRef?.current) {
      const scrollTop = chatContainerRef.current.scrollTop;
      chatScrollPositionsRef.current.set(previousActiveWindowRef.current, scrollTop);
    }
    
    // Restore scroll position for new window (or scroll to bottom if new)
    if (activeWindow && chatContainerRef.current && chatScrollPositionsRef?.current) {
      const savedScrollTop = chatScrollPositionsRef.current.get(activeWindow);
      
      setIsRestoringScroll(true);
      
      // Restore scroll position after a short delay to ensure DOM is updated
      setTimeout(() => {
        if (chatContainerRef.current) {
          if (savedScrollTop !== undefined) {
            chatContainerRef.current.scrollTop = savedScrollTop;
          } else {
            // No saved position, scroll to bottom for new windows
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
          // Reset flag after scroll is restored
          setTimeout(() => {
            setIsRestoringScroll(false);
          }, 100);
        }
      }, 10);
    } else if (!activeWindow) {
      // Console view - scroll to bottom
      setIsRestoringScroll(true);
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          setTimeout(() => {
            setIsRestoringScroll(false);
          }, 100);
        }
      }, 10);
    }
    
    previousActiveWindowRef.current = activeWindow;
  }, [activeWindow, chatScrollPositionsRef]);

  // Handle right-click context menu (only for console and channels, not private chats)
  const handleContextMenu = (e: React.MouseEvent) => {
    // Always prevent default browser context menu
    e.preventDefault();
    e.stopPropagation();
    
    // Only show console context menu for console view or channels, not private chats
    if (activeWindow && !activeWindow.startsWith('#')) {
      // Private chat - let Peer component handle it (but default is already prevented)
      return;
    }
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  // Handle context menu actions
  const handleContextAction = (action: string) => {
    console.log('Console context action:', action);
    // Implement actions here
    switch (action) {
      case 'clear':
        // Clear console - just clear any chat data if console has any
        // Note: Opening messages are static and will remain
        // This mainly clears any messages that might have been added
        if (setChannelChatData) {
          setChannelChatData(prev => ({
            ...prev,
            'console': []
          }));
        }
        break;
      case 'channels':
        // Open channels list
        break;
      case 'scripts':
        // Open scripts editor
        break;
      case 'options':
        // Open options dialog
        break;
      case 'connect':
        // Connect to server
        break;
      case 'disconnect':
        // Disconnect from server
        break;
      case 'about':
        // Show about dialog
        break;
    }
  };

  const ConsoleView = () => {

    return (
      <React.Fragment>
        {opening.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
        
        {/* Connection messages */}
        {connectionMessages.map((msg, index) => {
          const messageColor = msg.color || '#000b7d'; // Default navy blue
          return (
            <div key={`connection-${index}`} className="chat-item" style={{ fontSize: '13.9px' }}>
              {msg.event === 'server_info' && (
                <span style={{ color: messageColor }}>{msg.message}</span>
              )}
              {msg.event === 'connection' && (
                <span style={{ color: messageColor }}>{msg.message}</span>
              )}
            </div>
          );
        })}
      </React.Fragment>
    );
  }

  // Ref to store Peer's showWhois function
  const peerShowWhoisRef = React.useRef<(() => void) | null>(null);

  // Handle double-click on chat area for private chats
  const handleChatDoubleClick = React.useCallback((e: React.MouseEvent) => {
    // Only handle double-click for private chats (not channels)
    if (activeWindow && !activeWindow.startsWith('#')) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Double-click on chats div for private chat:', activeWindow);
      // Call the Peer's showWhois function if available
      if (peerShowWhoisRef.current) {
        console.log('Calling peerShowWhoisRef.current');
        peerShowWhoisRef.current();
      } else if (props.onPeerDoubleClick) {
        props.onPeerDoubleClick(activeWindow, () => {
          if (peerShowWhoisRef.current) {
            peerShowWhoisRef.current();
          }
        });
      }
    }
  }, [activeWindow, props]);

  return (
    <>
      <div 
        className="chats" 
        ref={chatContainerRef} 
        onScroll={handleScroll} 
        onContextMenu={handleContextMenu}
        onDoubleClick={(e) => {
          handleChatDoubleClick(e);
          // Prevent text selection on double click
          if (window.getSelection) {
            window.getSelection()?.removeAllRanges();
          }
        }}
        onMouseDown={(e) => {
          // Prevent text selection on double click
          if (e.detail > 1) {
            e.preventDefault();
          }
        }}
      >
        <div className="chat-content">

        {activeWindow === null && (
          <>
            <ConsoleView />
            {isLoading && !connected && connectionMessages.length === 0 && (
              <React.Suspense fallback={null}>
                <LoadingMock
                  currentUser={currentUser || 'User452'}
                  onComplete={() => { }}
                  loadingMessages={loadingMessages || []}
                  setLoadingMessages={setLoadingMessages}
                  loadingComplete={loadingComplete || false}
                  setLoadingComplete={setLoadingComplete}
                />
              </React.Suspense>
            )}
          </>
        )}
        {activeWindow && activeWindow.startsWith('#') &&
          <React.Suspense fallback={null}>
            <Channel
              connected={connected}
              chatContainerRef={chatContainerRef}
              userScrolledUp={userScrolledUp}
              currentUser={currentUser}
              channelName={activeWindow}
              channelChatData={channelChatData?.[activeWindow] || []}
              setChannelChatData={setChannelChatData}
              channelLoadingComplete={channelLoadingComplete?.[activeWindow] || false}
              setChannelLoadingComplete={setChannelLoadingComplete}
              onNicknameClick={onNicknameClick}
              onNicknameSelect={onNicknameSelect}
              isRestoringScroll={isRestoringScroll}
            />
          </React.Suspense>
        }
        {activeWindow && !activeWindow.startsWith('#') &&
          <React.Suspense fallback={null}>
            <Peer
              connected={connected}
              chatContainerRef={chatContainerRef}
              userScrolledUp={userScrolledUp}
              currentUser={currentUser}
              peerUser={activeWindow}
              peerChatData={channelChatData?.[activeWindow] || []}
              channelUserManagement={props.channelUserManagement}
              channelChatData={channelChatData}
              setChannelChatData={setChannelChatData}
              onDoubleClick={peerShowWhoisRef}
              onCloseChat={onCloseChat}
              onOpenChannel={onOpenChannel}
              isRestoringScroll={isRestoringScroll}
            />
          </React.Suspense>
        }

        </div>
      </div>

      {/* Context Menu */}
      {activeWindow === null && (
        <React.Suspense fallback={null}>
          <ContextMenu
            visible={contextMenu.visible}
            x={contextMenu.x}
            y={contextMenu.y}
            items={getConsoleContextMenuItems(handleContextAction)}
            onClose={() => setContextMenu({ visible: false, x: 0, y: 0 })}
            minWidth={220}
          />
        </React.Suspense>
      )}
    </>
  );

};

export default React.memo(Console);