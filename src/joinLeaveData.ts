// 200+ realistic IRC nicknames (inspired by actual IRC users)
export const dummyNicknames = [
  "Abcd", "Absinthe", "achiL", "Ada", "Adem", "aFa", "AfraN", "Agathadaimon",
  "Agrippa", "ahmetserkan", "Albatros", "ALem", "Alena", "alfarolex", "Ali",
  "Allecra", "AlpereN", "aLtimod", "Anaxagoras", "Aperson", "Ares", "AriC",
  "AspavA", "aSpeNDos", "AutomatiC", "AYARSIZ", "ayhan3", "Aylin", "Aytac",
  "Ayışığı", "Azely", "AzrA", "BarisBkmz", "Beatrice", "Beer", "BeiZa", "Berat",
  "Berk07", "bliss", "Bora", "BoRaN", "Burak-", "Buz", "By.Gece", "By_ATMACA",
  "Cadde_li", "CaNeRR", "capta1n", "cetoisak", "charizma", "Che", "Chelt",
  "CiyopiS", "ClupSohbet", "Coderlab", "coders", "Convex", "CORDON_BLEU", "Çöl",
  "d3L", "D3vr4N", "dae", "Dahaka", "Dedecan61", "dELi", "Demet34", "DeRBeDeR^",
  "Derya", "Discorium", "Domain", "DomainSatisi", "dOubLe", "eCeAy", "EdaLi",
  "eFe", "eiffel65", "Ekim", "eLfida", "Emrehan", "esekherif", "Eyluls",
  "Feronia", "Fikoo", "Fikret", "Forbidden", "fredyy", "Furkan-", "Gazino",
  "Gece", "GhostLy", "gRaL", "Gravity", "GulaSor", "Gurkan", "HackMan", "HaDeMe",
  "Hangman", "Harika", "HatemOgLu", "Heavenly", "Hesna", "HOROZ", "Hypatia!",
  "HyTecH", "IF-AI", "immortaL", "ImOriqinaL", "IrCbaStarD", "Irem", "JuDGe",
  "Kad", "Kalemzede", "Kamal", "KarabuluT", "KartaL", "keniShai", "Kerem",
  "Kharon", "knk", "Knox.", "KocaaLi", "Lawliet", "Liva", "Lose", "manikdepresif",
  "MateJaN", "meLanie", "Mervee", "Mihre", "MoHaC", "MoMoXa", "Murphy", "Mys",
  "NeverLove", "neXus", "Notcafe", "NucLeaR", "Oblivion", "Ocean", "omeGa",
  "Onurcann", "oSeNLuRDa_YaKa", "Pdocia", "PentagoN", "Pentagram", "Prosabox",
  "PySSyCaT", "Redworm", "ReisELLa", "ReSitaL", "RisK", "Risque", "RoCKeR",
  "Roger", "Ryu", "Ryze", "S3m1h", "S4S", "SamaEL`", "Sans", "SatO", "Sauron",
  "saydek", "scope", "Seden", "Selma", "shera_hanif", "Siyah", "SNOOPY",
  "Sohbetimsin", "Spacely", "Sparrow", "SpOkE", "Stskeep", "SucLu", "SuLh",
  "Supervisor", "Suzuki", "syasarizmir", "SınırımızGökyüzü", "temonde", "thelord",
  "Tupac", "Turk06", "Turkeri", "TövbeKaR", "uFuK", "Unknown", "UzmaN", "Vision",
  "volkan1tech", "woopie", "X", "Xadd1", "Xander", "xqxq", "xspy", "xwerswoodx",
  "Yabann", "Yalovali", "YekTa", "YouMyCure", "Yunus", "ZaferSahin", "ZaLiM1979",
  "Zanay", "Zardoz", "ZeL", "zetty", "ÖmerAsaF", "_KaCaK_",
  // Additional creative variations
  "Aphrodite", "BlackDragon", "CyberKnight", "DarkAngel", "EternalFlame",
  "FrostBite", "GameMaster", "HeartBreaker", "IceQueen", "JokerFace",
  "KnightRider", "LoneWolf", "MidnightSun", "NightHawk", "OceanDream",
  "PhoenixRising", "QuantumLeap", "RainbowWarrior", "SilverBullet", "ThunderStorm",
  "UltraViolet", "VenomStrike", "WhiteKnight", "XtremeGamer", "YellowSubmarine",
  "ZeroGravity", "Akira", "Blade", "Cipher", "Dagger", "Eclipse",
  "Falcon", "Ghost", "Hunter", "Inferno", "Joker", "Killer",
  "Legend", "Matrix", "Ninja", "Omega", "Phantom", "Quantum",
  "Raven", "Shadow", "Titan", "Ultra", "Viper", "Warrior",
  "Xenon", "Yakuza", "Zodiac", "Alpha", "Beta", "Delta"
];

// Channel density configuration
export const channelDensity = {
  '#str_chat': {
    joinRate: 3000,  // Average time between joins (3 seconds) - BUSIEST
    leaveRate: 8000, // Average time between leaves (8 seconds)
    maxUsers: 80,    // Maximum concurrent users
    stableLurkers: 100, // Stable users always in channel (no join/leave/chat)
    activityLevel: 'very_high'
  },
  '#PAPATYA': {
    joinRate: 8000,  // 8 seconds - MODERATE
    leaveRate: 15000, // 15 seconds
    maxUsers: 40,
    stableLurkers: 60, // Medium amount of lurkers
    activityLevel: 'moderate'
  },
  '#Webcam': {
    joinRate: 12000, // 12 seconds - LOW
    leaveRate: 20000, // 20 seconds
    maxUsers: 25,
    stableLurkers: 30, // Fewer lurkers
    activityLevel: 'low'
  }
};

// Extract pure join/leave events from chat data
export const extractJoinLeaveEvents = (chatData: any[]): Array<any> => {
  return chatData.filter(chat =>
    chat.event === 'login' || chat.event === 'quit'
  );
};

// Extract pure chat events (no join/leave)
export const extractChatOnlyEvents = (chatData: any[]): Array<any> => {
  return chatData.filter(chat =>
    chat.event !== 'login' && chat.event !== 'quit'
  );
};

// Generate random join/leave events for a channel
export const generateJoinLeaveEvents = (
  channelName: string,
  count: number = 50
): Array<any> => {
  const events: Array<any> = [];
  const usedNicknames = new Set<string>();

  for (let i = 0; i < count; i++) {
    // Get a random nickname that hasn't been used yet
    let nickname;
    let attempts = 0;
    do {
      nickname = dummyNicknames[Math.floor(Math.random() * dummyNicknames.length)];
      attempts++;
    } while (usedNicknames.has(nickname) && attempts < 50);

    usedNicknames.add(nickname);

    const isJoin = Math.random() > 0.5;

    if (isJoin) {
      events.push({
        time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        event: 'login',
        message: '',
        user: nickname,
        new_nick: null,
        email: `PAPATYAv7@${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.random().toString(36).substring(2, 10).toUpperCase()}.sibertr.online`,
        channel: channelName
      });
    } else {
      events.push({
        time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        event: 'quit',
        message: '',
        user: nickname,
        new_nick: null,
        email: `PAPATYAv7@${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.random().toString(36).substring(2, 10).toUpperCase()}.sibertr.online`,
        channel: null
      });
    }
  }

  return events;
};

// Blend chat events with join/leave events in a realistic way
export const blendChatAndJoinLeaveEvents = (
  chatEvents: Array<any>,
  joinLeaveEvents: Array<any>
): Array<any> => {
  const blended: Array<any> = [];
  let chatIndex = 0;
  let joinLeaveIndex = 0;

  while (chatIndex < chatEvents.length || joinLeaveIndex < joinLeaveEvents.length) {
    // Randomly decide whether to add a chat event or join/leave event
    // Bias towards chat events (70% chat, 30% join/leave)
    const shouldAddChat = Math.random() < 0.7;

    if (shouldAddChat && chatIndex < chatEvents.length) {
      blended.push(chatEvents[chatIndex]);
      chatIndex++;
    } else if (joinLeaveIndex < joinLeaveEvents.length) {
      blended.push(joinLeaveEvents[joinLeaveIndex]);
      joinLeaveIndex++;
    } else if (chatIndex < chatEvents.length) {
      // If we ran out of join/leave events, add remaining chat events
      blended.push(chatEvents[chatIndex]);
      chatIndex++;
    }
  }

  return blended;
};

// Get channel-specific join/leave delay based on density
export const getChannelJoinLeaveDelay = (channelName: string, isJoin: boolean): number => {
  const density = channelDensity[channelName as keyof typeof channelDensity];

  if (!density) {
    return isJoin ? 5000 : 10000; // Default delays
  }

  const baseDelay = isJoin ? density.joinRate : density.leaveRate;
  // Add random variation (±30%)
  const variation = baseDelay * 0.3;
  return baseDelay + (Math.random() * variation * 2 - variation);
};

// Extract unique users from chat data (users who actually chat)
export const extractChatUsers = (chatData: any[]): Array<{ nick: string, op: string }> => {
  const users = new Set<string>();

  chatData.forEach(chat => {
    if ((chat.event === 'chat' || chat.event === 'nick_change') && chat.user && chat.user.trim()) {
      users.add(chat.user);
    }
    // Also add the new_nick for nick changes
    if (chat.event === 'nick_change' && chat.new_nick && chat.new_nick.trim()) {
      users.add(chat.new_nick);
    }
  });

  // Convert to array and assign appropriate op levels
  return Array.from(users).map(user => {
    // Assign op levels based on user roles
    let op = '';
    if (user.includes('Admin') || user === 'bLueStar') {
      op = '~';
    } else if (user.includes('Mod') || user.includes('Moderator')) {
      op = '@';
    } else if (user.includes('Support') || user.includes('Manager')) {
      op = '+';
    }

    return { nick: user, op };
  });
};

// Generate stable lurkers (users always present but never chat or leave)
export const generateStableLurkers = (channelName: string): Array<{ nick: string, op: string }> => {
  const density = channelDensity[channelName as keyof typeof channelDensity];
  const lurkerCount = density ? density.stableLurkers : 50;

  const lurkers: Array<{ nick: string, op: string }> = [];
  const usedNicknames = new Set<string>();

  // Always add ~bLueStar as the first stable lurker (owner/admin)
  lurkers.push({ nick: 'bLueStar', op: '~' });
  usedNicknames.add('bLueStar');

  // Always add @esmerim_23 as a stable lurker (moderator/op)
  lurkers.push({ nick: 'esmerim_23', op: '@' });
  usedNicknames.add('esmerim_23');

  // Always add @NiGDe as a stable lurker (moderator/op)
  lurkers.push({ nick: 'NiGDe', op: '@' });
  usedNicknames.add('NiGDe');

  // Reserve first portion for cycling users
  const startIndex = 0;

  for (let i = 0; i < lurkerCount; i++) {
    let nickname;
    let attempts = 0;

    // Get unique nickname from the pool
    do {
      const index = startIndex + i;
      nickname = dummyNicknames[index % dummyNicknames.length];
      if (i >= dummyNicknames.length) {
        nickname = `${nickname}_${Math.floor(i / dummyNicknames.length)}`;
      }
      attempts++;
    } while (usedNicknames.has(nickname) && attempts < 100);

    usedNicknames.add(nickname);

    // Assign some users as half-ops or voice (5% chance each)
    let op = '';
    const rand = Math.random();
    if (rand < 0.05) {
      op = '%'; // Half-op
    } else if (rand < 0.10) {
      op = '+'; // Voice
    }

    lurkers.push({ nick: nickname, op });
  }

  return lurkers;
};

// User management structure
export interface ChannelUsers {
  chatUsers: Array<{ nick: string, op: string }>;      // Users who actually chat
  stableLurkers: Array<{ nick: string, op: string }>;  // Users always present, never chat/leave
  cyclingUsers: Array<{ nick: string, op: string }>;   // Users who join and leave
}

// Initialize channel users structure
export const initializeChannelUsers = (channelName: string, chatData: any[]): ChannelUsers => {
  return {
    chatUsers: extractChatUsers(chatData),
    stableLurkers: generateStableLurkers(channelName),
    cyclingUsers: []
  };
};

// Get all visible users for a channel (for user list display)
export const getAllChannelUsers = (channelUsers: ChannelUsers, currentUser: string): Array<{ nick: string, op: string }> => {
  const allUsers = [
    ...channelUsers.chatUsers,
    ...channelUsers.stableLurkers,
    ...channelUsers.cyclingUsers
  ];

  // Always add current user (nickname) if not already present
  const currentUserExists = allUsers.some(u => u.nick === currentUser);
  if (!currentUserExists) {
    allUsers.push({ nick: currentUser, op: '' });
  }

  // Always add ~bLueStar if not already present (with ~ op prefix for owner/admin)
  const blueStarExists = allUsers.some(u => u.nick === 'bLueStar');
  if (!blueStarExists) {
    allUsers.push({ nick: 'bLueStar', op: '~' });
  }

  // Always add @esmerim_23 if not already present (with @ op prefix for moderator/op)
  const esmerimExists = allUsers.some(u => u.nick === 'esmerim_23');
  if (!esmerimExists) {
    allUsers.push({ nick: 'esmerim_23', op: '@' });
  }

  // Always add @NiGDe if not already present (with @ op prefix for moderator/op)
  const nigdeExists = allUsers.some(u => u.nick === 'NiGDe');
  if (!nigdeExists) {
    allUsers.push({ nick: 'NiGDe', op: '@' });
  }

  // Remove duplicates
  const uniqueUsers = allUsers.filter((user, index, self) =>
    index === self.findIndex(u => u.nick === user.nick)
  );

  return uniqueUsers;
};

