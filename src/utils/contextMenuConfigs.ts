import { MenuItem } from '../components/ContextMenu';

/**
 * Context menu configuration for Console screen
 */
export const getConsoleContextMenuItems = (
  onAction: (action: string) => void
): MenuItem[] => {
  return [
    { id: 'clear', label: 'Clear', shortcut: 'Ctrl+L', onClick: () => onAction('clear') },
    { id: 'separator1', separator: true },
    { id: 'channels', label: 'Channels List...', ellipsis: true, onClick: () => onAction('channels') },
    { id: 'scripts', label: 'Scripts Editor...', ellipsis: true, onClick: () => onAction('scripts') },
    { id: 'options', label: 'Options...', shortcut: 'Alt+O', ellipsis: true, onClick: () => onAction('options') },
    { id: 'separator2', separator: true },
    { id: 'connect', label: 'Connect', onClick: () => onAction('connect') },
    { id: 'disconnect', label: 'Disconnect', onClick: () => onAction('disconnect') },
    { id: 'separator3', separator: true },
    { id: 'about', label: 'About PAPATYA v7...', ellipsis: true, onClick: () => onAction('about') },
  ];
};

/**
 * Context menu configuration for Channel screen
 */
export const getChannelContextMenuItems = (
  channelName: string,
  onAction: (action: string, channel?: string) => void
): MenuItem[] => {
  return [
    { id: 'clear', label: 'Clear', shortcut: 'Ctrl+L', onClick: () => onAction('clear', channelName) },
    { id: 'separator1', separator: true },
    { id: 'join', label: 'Join Channel...', ellipsis: true, shortcut: 'Ctrl+J', onClick: () => onAction('join') },
    { id: 'part', label: 'Part Channel', shortcut: 'Ctrl+P', onClick: () => onAction('part', channelName) },
    { id: 'separator2', separator: true },
    { id: 'topic', label: 'Channel Topic...', ellipsis: true, onClick: () => onAction('topic', channelName) },
    { id: 'mode', label: 'Channel Mode...', ellipsis: true, onClick: () => onAction('mode', channelName) },
    { id: 'banlist', label: 'Ban List...', ellipsis: true, onClick: () => onAction('banlist', channelName) },
    { id: 'separator3', separator: true },
    { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', onClick: () => onAction('copy') },
    { id: 'find', label: 'Find...', shortcut: 'Ctrl+F', ellipsis: true, onClick: () => onAction('find') },
    { id: 'separator4', separator: true },
    { id: 'ignore', label: 'Ignore List...', ellipsis: true, onClick: () => onAction('ignore') },
  ];
};

/**
 * Context menu configuration for Individual Chat (Peer) screen
 */
export const getPeerContextMenuItems = (
  peerUser: string,
  onAction: (action: string, user?: string) => void
): MenuItem[] => {
  return [
    { id: 'clear', label: 'Clear', shortcut: 'Ctrl+L', onClick: () => onAction('clear') },
    { id: 'separator1', separator: true },
    { id: 'whois', label: 'Who Is', shortcut: 'Ctrl+W', onClick: () => onAction('whois', peerUser) },
    { id: 'ping', label: 'Ping User', onClick: () => onAction('ping', peerUser) },
    { id: 'notice', label: 'Send Notice...', ellipsis: true, onClick: () => onAction('notice', peerUser) },
    { id: 'separator2', separator: true },
    { id: 'ignore', label: 'Ignore User', onClick: () => onAction('ignore', peerUser) },
    { id: 'separator3', separator: true },
    { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', onClick: () => onAction('copy') },
    { id: 'find', label: 'Find...', shortcut: 'Ctrl+F', ellipsis: true, onClick: () => onAction('find') },
    { id: 'separator4', separator: true },
    { id: 'close', label: 'Close', shortcut: 'Ctrl+W', onClick: () => onAction('close', peerUser) },
  ];
};

