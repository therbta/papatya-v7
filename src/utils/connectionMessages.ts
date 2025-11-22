import { config, formatDate } from '../const';

export interface ConnectionMessage {
  time: string;
  event: 'connection' | 'system' | 'server_info';
  message: string;
  color?: string;
}

// Generate random hostname
const generateHostname = (): string => {
  const prefixes = ['Yuzuk', 'SiberTR', 'Papatya'];
  const hexParts = Array.from({ length: 8 }, () => 
    Math.floor(Math.random() * 16).toString(16).toUpperCase()
  ).join('');
  const domains = ['hsd1.ma.comcast.net', 'sibertr.online', 'comcast.net'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${prefix}-${hexParts}.${domain}`;
};

// Generate random IP address
const generateIP = (): string => {
  return `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}`;
};

// Generate connection messages
export const generateConnectionMessages = (nickname: string, serverName: string): ConnectionMessage[] => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  const hostname = generateHostname();
  const ip = generateIP();
  
  // Format connection date with time (like in screenshot: "21 Kasım 2025 Cuma- Saat: 22:09:57")
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const dayName = days[now.getDay()];
  const time = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const connectionDateTime = `${day} ${month} ${year} ${dayName}- Saat: ${time}`;
  
  // Random user statistics
  const serverUsers = Math.floor(Math.random() * 100) + 30;
  const networkUsers = Math.floor(Math.random() * 200) + 200;
  const maxServerUsers = Math.floor(Math.random() * 4000) + 3500;
  const maxNetworkUsers = Math.floor(Math.random() * 400) + 250;
  const ircOps = Math.floor(Math.random() * 15) + 8;
  const activeChannels = Math.floor(Math.random() * 50) + 70;
  
  // Clean server name (remove spaces for connection message)
  const cleanServerName = serverName.replace(/\s+/g, '');
  
  return [
    {
      time: timeStr,
      event: 'connection',
      message: `* Connecting to ${config.server} (6667)`,
      color: '#00007a' // Navy blue (#00007a from op_colors)
    },
    {
      time: timeStr,
      event: 'connection',
      message: 'Ping? Pong!',
      color: '#008000' // Dark green (forest green)
    },
    {
      time: timeStr,
      event: 'connection',
      message: '[IRC VERSION]',
      color: '#00007a' // Navy blue
    },
    {
      time: timeStr,
      event: 'connection',
      message: `-> [IRC] VERSION ${config.script_name} MIRC ${config.script_version} by ${config.root_admin}`,
      color: '#00007a' // Navy blue
    },
    {
      time: timeStr,
      event: 'connection',
      message: `-${cleanServerName}- Sunucumuza bağlantı zamanınız: ${connectionDateTime}`,
      color: '#ff0000' // Red text
    },
    {
      time: timeStr,
      event: 'connection',
      message: 'Hoşgeldin',
      color: '#00007a' // Navy blue
    },
    {
      time: timeStr,
      event: 'connection',
      message: `Server versionu: ${config.script_name} ${config.script_version}`,
      color: '#666666' // Medium gray
    },
    {
      time: timeStr,
      event: 'connection',
      message: `Server Kuruluş Tarihi: ${new Date(2020, 0, 1).toLocaleDateString('tr-TR')} tarihinde kurulmuştur.`,
      color: '#666666' // Medium gray
    },
    {
      time: timeStr,
      event: 'connection',
      message: `Sunucu Adı: ${serverName} Kullanıcı: ${nickname} Çalışan Version: ${config.script_version} Mode: +iwx`,
      color: '#666666' // Medium gray
    },
    {
      time: timeStr,
      event: 'server_info',
      message: `HCN MAXCHANNELS=10 CHANLIMIT=#:10 HCN NICKLEN=30`,
      color: '#00007a' // Navy blue
    },
    {
      time: timeStr,
      event: 'server_info',
      message: `SILENCE=15 MODES=12 CHANTYPES=# SILENCE=15 CHANMODES=bel,kfL,lj,psmntirRcOAQKVCuzNSMTGZ`,
      color: '#00007a' // Navy blue
    },
    {
      time: timeStr,
      event: 'connection',
      message: `Hostunuz (${hostname}) olarak gizlenmiştir.`,
      color: '#666666' // Medium gray
    },
    {
      time: timeStr,
      event: 'connection',
      message: `Toplam kullanıcı sayısı: ${serverUsers} kullanıcı`,
      color: '#666666' // Medium gray
    },
    {
      time: timeStr,
      event: 'connection',
      message: `IRC'de olan IRCop sayısı: ${ircOps}`,
      color: '#666666' // Medium gray
    },
    {
      time: timeStr,
      event: 'connection',
      message: `Aktif kanal sayısı: ${activeChannels}`,
      color: '#666666' // Medium gray
    },
    {
      time: timeStr,
      event: 'connection',
      message: `Sunucudaki kullanıcı sayısı: ${serverUsers} En çok: ${maxServerUsers}`,
      color: '#666666' // Medium gray
    },
    {
      time: timeStr,
      event: 'connection',
      message: `Ağ üzerindeki kullanıcı sayısı: ${networkUsers} En çok: ${maxNetworkUsers}`,
      color: '#666666' // Medium gray
    },
    {
      time: timeStr,
      event: 'connection',
      message: '«[Server Motd Başlangıcı ]»',
      color: '#00007a' // Navy blue
    },
    {
      time: timeStr,
      event: 'connection',
      message: '─────────────────────────────────────────',
      color: '#666666' // Medium gray
    },
    {
      time: timeStr,
      event: 'connection',
      message: '«[Server Motd Sonu ]»',
      color: '#00007a' // Navy blue
    },
    {
      time: timeStr,
      event: 'connection',
      message: `* ${nickname} sets mode: +iwxY`,
      color: '#00007a' // Navy blue
    },
    {
      time: timeStr,
      event: 'connection',
      message: `Local host: ${hostname} (${ip})`,
      color: '#666666' // Medium gray
    },
    {
      time: timeStr,
      event: 'connection',
      message: `* ChanServ [services@${cleanServerName}] is on IRC (1379:20) (Kanal Servisi)`,
      color: '#00007a' // Navy blue
    },
    {
      time: timeStr,
      event: 'connection',
      message: `* MemoServ [services@${cleanServerName}] is on IRC (1379:20) (Mesaj Servisi)`,
      color: '#00007a' // Navy blue
    },
    {
      time: timeStr,
      event: 'connection',
      message: `* NickServ [services@${cleanServerName}] is on IRC (1379:20) (Nick Servisi)`,
      color: '#00007a' // Navy blue
    }
  ];
};

