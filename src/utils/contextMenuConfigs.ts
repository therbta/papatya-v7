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
    { id: 'separator5', separator: true },
    { id: 'close', label: 'Close', shortcut: 'Ctrl+F4', onClick: () => onAction('close', channelName) },
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
    { id: 'header', label: 'PAPATYA v7 e-MIRC', onClick: () => { }, disabled: true },
    { id: 'dcc', label: 'DCC', onClick: () => onAction('dcc', peerUser) },
    { id: 'ignore_engelle', label: 'Ignore (Engelle)', onClick: () => onAction('ignore', peerUser) },
    { id: 'notify', label: 'Notify', onClick: () => onAction('notify', peerUser) },
    { id: 'separator2', separator: true },
    { id: 'whois_cek', label: '+ Whois Cek', onClick: () => onAction('whois', peerUser) },
    { id: 'nick_infosu', label: '+ Nick Infosu', onClick: () => onAction('nickinfo', peerUser) },
    { id: 'dupman_listesi', label: '+ Düpman Listesi', onClick: () => onAction('dupman', peerUser) },
    { id: 'ping_yolla', label: '+ Ping Yolla', onClick: () => onAction('ping', peerUser) },
    { id: 'separator3', separator: true },
    { id: 'op_islemleri', label: 'Op İşlemleri', onClick: () => onAction('op', peerUser) },
    { id: 'log_tut', label: 'Log Tut', onClick: () => onAction('log', peerUser) },
    { id: 'separator4', separator: true },
    { id: 'eglence_edebiyat', label: 'Eğlence/Edebiyat', onClick: () => onAction('eglence', peerUser) },
    { id: 'separator5', separator: true },
    { id: 'diger_islemler', label: 'Diğer İşlemler', onClick: () => onAction('diger', peerUser) },
    { id: 'separator6', separator: true },
    { id: 'web_kamerasi', label: '!! Web Kamerası !!', onClick: () => onAction('webcam', peerUser) },
    { id: 'separator7', separator: true },
    { id: 'close', label: 'Close', shortcut: 'Ctrl+F4', onClick: () => onAction('close', peerUser) },
  ];
};

/**
 * Context menu configuration for Private Chat Tab buttons (on right side)
 */
export const getPeerTabContextMenuItems = (
  peerUser: string,
  onAction: (action: string, user?: string) => void
): MenuItem[] => {
  return [
    { id: 'desktop', label: 'Desktop', onClick: () => onAction('desktop', peerUser) },
    { id: 'ontop', label: 'On Top', onClick: () => onAction('ontop', peerUser) },
    { id: 'separator1', separator: true },
    { id: 'background', label: 'Background', onClick: () => onAction('background', peerUser) },
    { id: 'buffer', label: 'Buffer', onClick: () => onAction('buffer', peerUser) },
    { id: 'logging', label: 'Logging', onClick: () => onAction('logging', peerUser) },
    { id: 'position', label: 'Position', onClick: () => onAction('position', peerUser) },
    { id: 'spacing', label: 'Spacing', onClick: () => onAction('spacing', peerUser) },
    { id: 'timestamp', label: 'Timestamp', onClick: () => onAction('timestamp', peerUser) },
    { id: 'separator2', separator: true },
    { id: 'font', label: 'Font...', ellipsis: true, onClick: () => onAction('font', peerUser) },
    { id: 'beeping', label: 'Beeping', onClick: () => onAction('beeping', peerUser) },
    { id: 'flashing', label: 'Flashing', onClick: () => onAction('flashing', peerUser) },
    { id: 'trackurls', label: 'Track Urls', onClick: () => onAction('trackurls', peerUser) },
    { id: 'separator3', separator: true },
    { id: 'restore', label: 'Restore', onClick: () => onAction('restore', peerUser) },
    { id: 'move', label: 'Move', disabled: true, onClick: () => onAction('move', peerUser) },
    { id: 'size', label: 'Size', disabled: true, onClick: () => onAction('size', peerUser) },
    { id: 'minimize', label: 'Minimize', onClick: () => onAction('minimize', peerUser) },
    { id: 'maximize', label: 'Maximize', onClick: () => onAction('maximize', peerUser) },
    { id: 'separator4', separator: true },
    { id: 'close', label: 'Close', shortcut: 'Ctrl+F4', onClick: () => onAction('close', peerUser) },
    { id: 'next', label: 'Next', shortcut: 'Ctrl+F6', onClick: () => onAction('next', peerUser) },
  ];
};

