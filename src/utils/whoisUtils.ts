import { config } from '../const';

export interface WhoisInfo {
  nick: string;
  ip: string;
  isim: string;
  rumuzBilgi: string;
  kanallar: string[];
  server: string;
}

// Generate IP address in format like: PAPATYAv7@77.12.UU8F6ISU.sibertr.online
const generateIP = (nick: string): string => {
  // Generate consistent random alphanumeric string (8 characters, uppercase) based on nick
  const hash = nick.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomPart = Array.from({ length: 8 }, (_, i) => {
    const charCode = (hash * (i + 1) * 7) % 36;
    return charCode < 10 ? charCode.toString() : String.fromCharCode(charCode - 10 + 65);
  }).join('');

  return `PAPATYAv7@77.12.${randomPart}.sibertr.online`;
};

// Generate real name (İsim) - always sibertr.online
const generateIsim = (nick: string): string => {
  return 'sibertr.online';
};

// Check if nickname is registered (some special users are always registered)
const isRegisteredNick = (nick: string): boolean => {
  // Always registered users
  const registeredNicks = ['bLueStar', 'esmerim_23', 'NiGDe', 'BoRaN', 'KartaL', 'Kerem'];
  if (registeredNicks.includes(nick)) {
    return true;
  }

  // Random chance for other users (70% registered)
  return Math.random() > 0.3;
};

// Get rumuz bilgi text
const getRumuzBilgi = (nick: string): string => {
  if (isRegisteredNick(nick)) {
    return `${nick} Kayıtlı bir nicktir`;
  }
  return `${nick} Kayıtlı bir nick değildir`;
};

// Generate whois info for a user
export const generateWhoisInfo = (
  nick: string,
  channels: string[] = []
): WhoisInfo => {
  return {
    nick,
    ip: generateIP(nick),
    isim: generateIsim(nick),
    rumuzBilgi: getRumuzBilgi(nick),
    kanallar: channels.length > 0 ? channels : [],
    server: 'SiberTR IRC Network - sibertr.online'
  };
};

// Find which channels a user is in
export const getUserChannels = (
  nick: string,
  channelUserManagement?: Record<string, any>,
  channelChatData?: Record<string, Array<any>>
): string[] => {
  const userChannels: string[] = [];
  const channelsSet = new Set<string>();

  // Check channelUserManagement for channels where user is listed
  if (channelUserManagement) {
    Object.keys(channelUserManagement).forEach(channelName => {
      const channelUsers = channelUserManagement[channelName];
      if (channelUsers) {
        // Check if user is in chatUsers, stableLurkers, or cyclingUsers
        const allUsers = [
          ...(channelUsers.chatUsers || []),
          ...(channelUsers.stableLurkers || []),
          ...(channelUsers.cyclingUsers || [])
        ];

        const userExists = allUsers.some((u: { nick: string }) => u.nick === nick);
        if (userExists) {
          channelsSet.add(channelName);
        }
      }
    });
  }

  // Also check channelChatData for channels where user has sent messages
  if (channelChatData) {
    Object.keys(channelChatData).forEach(channelName => {
      // Only check channel names (starting with #)
      if (channelName.startsWith('#')) {
        const messages = channelChatData[channelName];
        if (messages && messages.some((msg: any) => msg.user === nick)) {
          channelsSet.add(channelName);
        }
      }
    });
  }

  return Array.from(channelsSet);
};
