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

  // Track last selected index per letter for cycling through nicknames
  const lastSelectedIndexByLetter = React.useRef<Map<string, number>>(new Map());

  // Refs for each nickname item
  const itemRefs = React.useRef<Map<number, HTMLDivElement>>(new Map());

  // Store scroll positions per channel to preserve when switching
  const scrollPositionsRef = React.useRef<Map<string, number>>(new Map());

  // Track if this is the initial render for a channel (to prevent auto-scroll)
  const isInitialRenderRef = React.useRef<Map<string, boolean>>(new Map());

  // Track previous activeWindow to detect channel switches
  const prevActiveWindowRef = React.useRef<string | null | undefined>(activeWindow);

  // Reset letter index tracking when user list changes (channel switch, etc.)
  React.useEffect(() => {
    lastSelectedIndexByLetter.current.clear();

    // Detect channel switch
    const isChannelSwitch = prevActiveWindowRef.current !== activeWindow &&
      activeWindow && activeWindow.startsWith('#');

    if (isChannelSwitch && prevActiveWindowRef.current) {
      // Save scroll position for previous channel
      const listContainer = document.querySelector('.list') as HTMLElement;
      if (listContainer && prevActiveWindowRef.current) {
        scrollPositionsRef.current.set(prevActiveWindowRef.current, listContainer.scrollTop);
      }
    }

    // Mark as initial render if this is a new channel or first time seeing this channel
    if (isChannelSwitch || !isInitialRenderRef.current.has(activeWindow || '')) {
      if (activeWindow) {
        isInitialRenderRef.current.set(activeWindow, true);
      }
    }

    prevActiveWindowRef.current = activeWindow;
  }, [channelUserManagement, activeWindow]);

  // Restore scroll position when switching to a channel (but not on initial selection change)
  React.useEffect(() => {
    if (!activeWindow || !activeWindow.startsWith('#')) return;

    const isInitial = isInitialRenderRef.current.get(activeWindow);
    if (!isInitial) {
      // Restore saved scroll position for this channel
      const savedScrollTop = scrollPositionsRef.current.get(activeWindow);
      if (savedScrollTop !== undefined) {
        setTimeout(() => {
          const listContainer = document.querySelector('.list') as HTMLElement;
          if (listContainer && savedScrollTop !== listContainer.scrollTop) {
            listContainer.scrollTop = savedScrollTop;
          }
        }, 10);
      }
    } else {
      // Mark as no longer initial render after a short delay
      setTimeout(() => {
        isInitialRenderRef.current.set(activeWindow, false);
      }, 100);
    }
  }, [activeWindow]);

  // Track previous selected to detect actual selection changes (not just re-renders)
  const prevSelectedRef = React.useRef<number | null>(selected);

  // Scroll to selected nickname when selection changes (but not on channel switch)
  React.useEffect(() => {
    if (selected !== null && selected >= 0) {
      const isInitial = activeWindow ? isInitialRenderRef.current.get(activeWindow) : false;
      const isActualSelectionChange = prevSelectedRef.current !== selected && !isInitial;

      // Only scroll if this is an actual selection change (user clicked/keyboard), not initial render
      if (isActualSelectionChange) {
        const selectedItem = itemRefs.current.get(selected);

        if (selectedItem) {
          // Find the parent scrollable container (the .list div)
          let scrollContainer: HTMLElement | null = selectedItem.parentElement;
          while (scrollContainer) {
            const style = window.getComputedStyle(scrollContainer);
            if (style.overflow === 'auto' || style.overflow === 'scroll' ||
              style.overflowY === 'auto' || style.overflowY === 'scroll') {
              break;
            }
            scrollContainer = scrollContainer.parentElement;
          }

          // If found a scroll container, check if item is visible
          if (scrollContainer) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const itemRect = selectedItem.getBoundingClientRect();

            // Check if item is outside visible area
            const isAboveViewport = itemRect.top < containerRect.top;
            const isBelowViewport = itemRect.bottom > containerRect.bottom;

            if (isAboveViewport || isBelowViewport) {
              // Scroll the item into view smoothly
              selectedItem.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
              });
            }
          } else {
            // Fallback: just scroll into view (will use nearest scrollable ancestor)
            selectedItem.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }
        }
      }

      prevSelectedRef.current = selected;
    } else {
      prevSelectedRef.current = null;
    }
  }, [selected, activeWindow]);

  // Keyboard navigation: press a letter to select the first nickname starting with that letter
  // Press the same letter again to cycle through all nicknames starting with that letter
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

      // Find all users whose nickname starts with the pressed letter
      const matchingUsers = sortedUsers
        .map((user, idx) => ({ user, idx }))
        .filter(({ user }) => user.nick.toLowerCase().startsWith(letter));

      if (matchingUsers.length === 0) {
        // No users found starting with this letter
        lastSelectedIndexByLetter.current.delete(letter);
        return;
      }

      // Get the last selected index for this letter
      const lastSelectedIdx = lastSelectedIndexByLetter.current.get(letter);

      let nextIndex: number;

      if (lastSelectedIdx === undefined) {
        // First time pressing this letter - select the first match
        nextIndex = matchingUsers[0].idx;
      } else {
        // Find the current selection in the matching users list
        const currentMatchIndex = matchingUsers.findIndex(({ idx }) => idx === lastSelectedIdx);

        if (currentMatchIndex === -1 || currentMatchIndex === matchingUsers.length - 1) {
          // Current selection not in matches or it's the last match - wrap to first
          nextIndex = matchingUsers[0].idx;
        } else {
          // Move to next match
          nextIndex = matchingUsers[currentMatchIndex + 1].idx;
        }
      }

      // Update the last selected index for this letter and select the new index
      // Safety check: ensure nextIndex is valid
      if (nextIndex >= 0 && nextIndex < sortedUsers.length) {
        lastSelectedIndexByLetter.current.set(letter, nextIndex);
        setSelected(nextIndex);
        console.log(`Selected user starting with '${letter}':`, sortedUsers[nextIndex].nick);
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
        const firstLetter = nick.toLowerCase().charAt(0);

        return (
          <div
            key={index}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(index, el);
              } else {
                itemRefs.current.delete(index);
              }
            }}
            style={{ color }}
            className={`nick-item ${selected === index ? "selected" : ""}`}
            onClick={() => {
              // Update last selected index for this letter when manually clicking
              lastSelectedIndexByLetter.current.set(firstLetter, index);
              setSelected(index);
            }}
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