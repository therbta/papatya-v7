import React from 'react'

// UI - No animations for authentic mIRC experience

// Consts
import { opPriority, op_colors } from '../const';
import { getAllChannelUsers, type ChannelUsers } from '../joinLeaveData';

type Props = {
  hideComponent: boolean;
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  chatUsers: string[];
  setChatUsers: React.Dispatch<React.SetStateAction<string[]>>;
  nickname: string;
  onSendMessage?: (message: string) => void;
  onOpenChatWindow?: (user: string) => void;
  activeWindow?: string | null;
  channelChatData?: Array<any>;
  channelUserManagement?: ChannelUsers;
}

const List = (props: Props) => {
  // Props
  const { hideComponent, selected, setSelected, chatUsers, setChatUsers, nickname, onSendMessage, onOpenChatWindow, activeWindow, channelChatData, channelUserManagement } = props;

  // Context menu state
  const [contextMenu, setContextMenu] = React.useState<{ visible: boolean, x: number, y: number, user: string }>({
    visible: false,
    x: 0,
    y: 0,
    user: ''
  });

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ visible: false, x: 0, y: 0, user: '' });
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.visible]);

  // Keyboard navigation: press a letter to select the first nickname starting with that letter
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if the list is visible (not hidden)
      if (hideComponent) return;

      // Only handle single letter keys
      if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;

      const letter = e.key.toLowerCase();

      // Get users from channel user management
      let users: Array<{ nick: string, op: string }> = [];
      if (channelUserManagement) {
        users = getAllChannelUsers(channelUserManagement, nickname);
      } else if (activeWindow && !activeWindow.startsWith('#')) {
        users = [{ nick: nickname, op: '' }];
      } else {
        users = [{ nick: nickname, op: '' }];
      }

      // Sort users by priority & alphabetically
      const sortedUsers = [...users].sort((a, b) => {
        const priorityA = opPriority[a.op] || 99;
        const priorityB = opPriority[b.op] || 99;
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        return a.nick.localeCompare(b.nick);
      });

      // Find the first user whose nickname starts with the pressed letter
      const index = sortedUsers.findIndex(user =>
        user.nick.toLowerCase().startsWith(letter)
      );

      if (index !== -1) {
        setSelected(index);
        console.log(`Selected user starting with '${letter}':`, sortedUsers[index].nick);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [hideComponent, channelUserManagement, nickname, activeWindow, setSelected]);

  // Early return AFTER all hooks have been called
  if (hideComponent) return null;

  // Get users from channel user management (chat users + stable lurkers + cycling users)
  let updatedNicknames: Array<{ nick: string, op: string }> = [];

  if (channelUserManagement) {
    // Use the smart user management system
    updatedNicknames = getAllChannelUsers(channelUserManagement, nickname);
  } else if (activeWindow && !activeWindow.startsWith('#')) {
    // For private chats, show only the current user
    updatedNicknames = [{ nick: nickname, op: '' }];
  } else {
    // Fallback: just show current user
    updatedNicknames = [{ nick: nickname, op: '' }];
  }

  // Sort the updated nicknames list by priority & alphabetically
  const sortedNicknames = [...updatedNicknames].sort((a, b) => {
    const priorityA = opPriority[a.op] || 99;
    const priorityB = opPriority[b.op] || 99;
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return a.nick.localeCompare(b.nick);
  });

  // Handle right-click context menu
  const handleRightClick = (e: React.MouseEvent, user: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      user: user
    });
  };

  // Handle context menu actions
  const handleContextAction = (action: string, user: string) => {
    setContextMenu({ visible: false, x: 0, y: 0, user: '' });

    switch (action) {
      case 'whois':
        onSendMessage && onSendMessage(`/whois ${user}`);
        break;
      case 'ping':
        onSendMessage && onSendMessage(`/ping ${user}`);
        break;
      case 'notice':
        onSendMessage && onSendMessage(`/notice ${user} `);
        break;
      case 'ignore':
        onSendMessage && onSendMessage(`/ignore ${user}`);
        break;
      case 'kick':
        onSendMessage && onSendMessage(`/kick ${user}`);
        break;
      case 'ban':
        onSendMessage && onSendMessage(`/ban ${user}`);
        break;
    }
  };

  return (
    <>
      {sortedNicknames.map((item, index) => {
        const { nick, op } = item;
        const color = op_colors.find((opItem) => opItem.sign === op)?.color;

        return (
          <div
            key={index}
            style={{ color }}
            className={`nick-item ${selected === index ? "selected" : ""}`}
            onClick={() => setSelected(index)}
            onDoubleClick={() => {
              // Open chat window for this user (it will handle adding to chatUsers)
              onOpenChatWindow && onOpenChatWindow(nick);
            }}
            onContextMenu={(e) => handleRightClick(e, nick)}
          >
            {op}
            {nick}
          </div>
        );
      })}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            backgroundColor: '#f5f5f5',
            border: '1px solid #a6a6a6',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
            minWidth: '120px'
          }}
        >
          <div
            className="context-menu-item"
            onClick={() => handleContextAction('whois', contextMenu.user)}
            style={{ padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}
          >
            Who is {contextMenu.user}
          </div>
          <div
            className="context-menu-item"
            onClick={() => handleContextAction('ping', contextMenu.user)}
            style={{ padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}
          >
            Ping {contextMenu.user}
          </div>
          <div
            className="context-menu-item"
            onClick={() => handleContextAction('notice', contextMenu.user)}
            style={{ padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}
          >
            Notice {contextMenu.user}
          </div>
          <div
            className="context-menu-item"
            onClick={() => handleContextAction('ignore', contextMenu.user)}
            style={{ padding: '4px 8px', cursor: 'pointer', fontSize: '12px', borderTop: '1px solid #ccc' }}
          >
            Ignore {contextMenu.user}
          </div>
          <div
            className="context-menu-item"
            onClick={() => handleContextAction('kick', contextMenu.user)}
            style={{ padding: '4px 8px', cursor: 'pointer', fontSize: '12px', color: '#cc0000' }}
          >
            Kick {contextMenu.user}
          </div>
          <div
            className="context-menu-item"
            onClick={() => handleContextAction('ban', contextMenu.user)}
            style={{ padding: '4px 8px', cursor: 'pointer', fontSize: '12px', color: '#cc0000' }}
          >
            Ban {contextMenu.user}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(List);