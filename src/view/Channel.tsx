import React, { JSX } from 'react'

// Components
const ContextMenu = React.lazy(() => import('../components/ContextMenu'));

// Utils
import { getChannelContextMenuItems } from '../utils/contextMenuConfigs';

type Props = {
  connected: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  userScrolledUp: React.RefObject<boolean>;
  currentUser?: string;
  channelName: string;
  channelChatData: Array<any>;
  setChannelChatData?: React.Dispatch<React.SetStateAction<Record<string, Array<any>>>>;
  channelLoadingComplete: boolean;
  setChannelLoadingComplete?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onNicknameClick?: (nickname: string) => void;
  onNicknameSelect?: (nickname: string) => void;
}

const Channel = (props: Props) => {

  // Props:
  const { connected, chatContainerRef, userScrolledUp, currentUser, channelName, channelChatData, channelLoadingComplete, onNicknameClick, onNicknameSelect } = props;

  // Context menu state
  const [contextMenu, setContextMenu] = React.useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0
  });

  // Use channel-specific chat data
  const displayedChats = channelChatData;

  // Auto-scroll when new messages arrive
  React.useEffect(() => {
    if (chatContainerRef.current && !userScrolledUp.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [displayedChats.length, chatContainerRef, userScrolledUp]);


  // Use displayed chats directly (no merging needed - messages are already in channelChatData)
  const allMessages = React.useMemo(() => {
    return displayedChats;
  }, [displayedChats]);

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  // Handle context menu actions
  const handleContextAction = (action: string, channel?: string) => {
    console.log('Channel context action:', action, channel);
    // Implement actions here
    switch (action) {
      case 'clear':
        // Clear channel messages
        break;
      case 'join':
        // Join channel dialog
        break;
      case 'part':
        // Part from channel
        break;
      case 'topic':
        // Edit channel topic
        break;
      case 'mode':
        // Edit channel mode
        break;
      case 'banlist':
        // View ban list
        break;
      case 'copy':
        // Copy selected text
        break;
      case 'find':
        // Find dialog
        break;
      case 'ignore':
        // Ignore list dialog
        break;
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }} onContextMenu={handleContextMenu}>
        <div style={{ marginTop: "auto" }}>

        {allMessages.map((chat, index) => {

          const { time, event, message, user, new_nick, email, channel } = chat;
          const isCurrentUser = currentUser && user === currentUser;

          let row: JSX.Element | null = null;

          if (event === "login") {

            row = (
              <span style={{ color: "#129393" }}>
                *** Giriş: <span
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    fontWeight: "normal"
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onNicknameSelect?.(user);
                  }}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onNicknameClick?.(user);
                  }}
                  title="Click to select, double-click to open chat"
                >
                  {user}
                </span> ({email}) {channel}
              </span>
            );

          } else if (event === "chat") {

            row = (
              <span>
                <span
                  className="clickable-nickname"
                  style={{
                    color: isCurrentUser ? "#0066cc" : "#7e0505",
                    fontWeight: "normal",
                    cursor: "pointer",
                    textDecoration: "none",
                    fontSize: "14px"
                  }}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Nickname double-clicked:', user);
                    onNicknameClick?.(user);
                  }}
                  title="Double-click to open private chat"
                >
                  {`<${user}>`}
                </span>
                : {message}
              </span>
            );

          } else if (event === "quit") {

            row = (
              <span style={{ color: "#000b7d" }}>
                *** Çıkış: {user} ({email})
              </span>
            );

          } else if (event === "nick_change") {

            row = (
              <span className="font-medium" style={{ color: "#189213" }}>
                * {user} nickini {new_nick} olarak değiştirdi.
              </span>
            )

          }

          return (
            <div
              key={`${index}-${user}-${time}`}
              className="chat-item"
            >
              <span className="chat-time pe-1">[{time}]</span>
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
          items={getChannelContextMenuItems(channelName, handleContextAction)}
          onClose={() => setContextMenu({ visible: false, x: 0, y: 0 })}
          minWidth={220}
        />
      </React.Suspense>
    </>
  )
}

export default React.memo(Channel)