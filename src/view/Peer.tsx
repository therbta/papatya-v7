import React from 'react'

// Components
const ContextMenu = React.lazy(() => import('../components/ContextMenu'));

// Utils
import { getPeerContextMenuItems } from '../utils/contextMenuConfigs';

type Props = {
  connected: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  userScrolledUp: React.RefObject<boolean>;
  currentUser?: string;
  peerUser?: string;
  peerChatData: Array<any>;
}

const Peer = (props: Props) => {
  const { connected, chatContainerRef, userScrolledUp, currentUser, peerUser, peerChatData } = props;

  // Context menu state
  const [contextMenu, setContextMenu] = React.useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0
  });

  // Use peer-specific chat data
  const allMessages = React.useMemo(() => {
    return peerChatData;
  }, [peerChatData]);

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
  const handleContextAction = (action: string, user?: string) => {
    console.log('Peer context action:', action, user);
    // Implement actions here
    switch (action) {
      case 'clear':
        // Clear chat messages
        break;
      case 'whois':
        // Who is user
        break;
      case 'ping':
        // Ping user
        break;
      case 'notice':
        // Send notice
        break;
      case 'ignore':
        // Ignore user
        break;
      case 'copy':
        // Copy selected text
        break;
      case 'find':
        // Find dialog
        break;
      case 'close':
        // Close chat window
        break;
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }} onContextMenu={handleContextMenu}>
        <div style={{ marginTop: "auto" }}>
        {allMessages.map((chat, index) => {
          const { time, event, message, user } = chat;
          const isCurrentUser = currentUser && user === currentUser;

          let row: JSX.Element | null = null;

          if (event === "chat") {
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
          items={getPeerContextMenuItems(peerUser || '', handleContextAction)}
          onClose={() => setContextMenu({ visible: false, x: 0, y: 0 })}
          minWidth={220}
        />
      </React.Suspense>
    </>
  )
}

export default React.memo(Peer);