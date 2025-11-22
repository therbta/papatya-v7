// Channel header information generator

export interface ChannelHeaderInfo {
  topic: string;
  topicUrl: string;
  topicMessage: string;
  createdDate: string;
  topicSetBy: string;
  opCount: number;
  voiceCount: number;
  totalUsers: number;
}

// Generate channel topic based on channel name
const generateChannelTopic = (channelName: string): { topic: string; topicUrl: string; topicMessage: string } => {
  const channelMap: Record<string, { topic: string; topicUrl: string; topicMessage: string }> = {
    '#str_chat': {
      topic: 'PAPATYA v7 e-MIRC',
      topicUrl: 'sibertr.online',
      topicMessage: "SiberTR IRC Network - Türkiye'nin En Popüler IRC Sohbet Sunucusuna Hoşgeldiniz."
    },
    '#PAPATYA': {
      topic: 'PAPATYA v7 e-MIRC',
      topicUrl: 'sibertr.online',
      topicMessage: 'PAPATYA mIRC Script v7 ile gerçek zamanlı IRC sohbeti. SiberTR IRC Network.'
    },
    '#Webcam': {
      topic: 'PAPATYA v7 e-MIRC',
      topicUrl: 'sibertr.online',
      topicMessage: 'Webcam paylaşım kanalına hoş geldiniz. SiberTR IRC Network - sibertr.online'
    }
  };

  return channelMap[channelName] || {
    topic: 'PAPATYA v7 e-MIRC',
    topicUrl: 'sibertr.online',
    topicMessage: 'SiberTR IRC Network kanalına hoş geldiniz. sibertr.online'
  };
};

// Generate channel creation date (random past date)
const generateChannelCreatedDate = (channelName: string): string => {
  // Generate a consistent date based on channel name
  const hash = channelName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const daysAgo = 100 + (hash % 2000); // Between 100-2100 days ago
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  // Format: "Sun Jun 08 17:24:44 2025"
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${dayName} ${monthName} ${day} ${hours}:${minutes}:${seconds} ${year}`;
};

// Generate topic set by (random op user from channel users with prefixes)
const generateTopicSetBy = (channelUsers?: Array<{ nick: string; op: string }>): string => {
  // Default fallback users if no channel users provided
  const defaultUsers = ['bLueStar', 'BoRaN', 'KartaL', 'NiGDe', 'Kerem', 'esmerim_23', 'SiyahLeo', 'HyTecH'];

  if (!channelUsers || channelUsers.length === 0) {
    // Randomly select from default users
    return defaultUsers[Math.floor(Math.random() * defaultUsers.length)];
  }

  // Filter users with op prefixes (~, &, @, %, +)
  const opUsers = channelUsers.filter(user =>
    user.op && user.op.trim() !== '' && ['~', '&', '@', '%', '+'].includes(user.op)
  );

  // If no op users found, fall back to default
  if (opUsers.length === 0) {
    return defaultUsers[Math.floor(Math.random() * defaultUsers.length)];
  }

  // Randomly select from op users in the channel
  const randomIndex = Math.floor(Math.random() * opUsers.length);
  return opUsers[randomIndex].nick;
};

// Generate channel header info
export const generateChannelHeaderInfo = (
  channelName: string,
  totalUsers: number,
  channelUsers?: Array<{ nick: string; op: string }>
): ChannelHeaderInfo => {
  const topicInfo = generateChannelTopic(channelName);
  const opCount = Math.floor(totalUsers * 0.1); // ~10% are ops
  const voiceCount = Math.floor(totalUsers * 0.05); // ~5% have voice

  // Collect all users from channelUsers if provided
  const allChannelUsers = channelUsers || [];

  return {
    topic: topicInfo.topic,
    topicUrl: topicInfo.topicUrl,
    topicMessage: topicInfo.topicMessage,
    createdDate: generateChannelCreatedDate(channelName),
    topicSetBy: generateTopicSetBy(allChannelUsers),
    opCount,
    voiceCount,
    totalUsers
  };
};

