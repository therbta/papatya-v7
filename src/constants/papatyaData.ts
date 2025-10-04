// PAPATYA v5 Original Dialog Data
export const PAPATYA_DATA = {
  // Navigation tabs
  tabs: [
    { id: 'korumalar', label: 'Korumalar' },
    { id: 'ayarlar', label: 'Ayarlar' },
    { id: 'hakkinda', label: 'Hakkında' }
  ],

  // Server/Channel buttons (3 rows of 4)
  servers: [
    // First row
    { id: 'sohbethane', name: 'SohbetHane.Net', url: 'irc.sohbethane.net', port: 6667 },
    { id: 'sibertr', name: 'SiberTR.Net', url: 'irc.sibertr.online', port: 6667 },
    { id: 'turkmuhabbet', name: 'TurkMuhabbet.Com', url: 'irc.turkmuhabbet.com', port: 6667 },
    { id: 'chatnet', name: 'ChatNet', url: 'irc.chatnet.net', port: 6667 },

    // Second row
    { id: 'mircindir', name: 'mIRCIndir', url: 'irc.mircindir.net', port: 6667 },
    { id: 'hayta', name: 'Hayta', url: 'irc.hayta.net', port: 6667 },
    { id: 'mircturk', name: 'mIRCTurk', url: 'irc.mircturk.net', port: 6667 },
    { id: 'sohbete', name: 'Sohbete', url: 'irc.sohbete.net', port: 6667 },

    // Third row
    { id: 'mynet', name: 'MyNet', url: 'irc.mynet.net', port: 6667 },
    { id: 'papatya', name: 'Papatya', url: 'irc.papatya.net', port: 6667 },
    { id: 'bitanem', name: 'Bitanem', url: 'irc.bitanem.net', port: 6667 },
    { id: 'klavye', name: 'Klavye', url: 'irc.klavye.net', port: 6667 }
  ],

  // Default settings
  defaults: {
    nickname: 'RBT',
    defaultServer: 'SiberTR.Net',
    website: 'http://www.sibertr.online'
  },

  // Connection icon (house with satellite)
  connectionIcon: '🏠📡', // Using emoji as placeholder, will be replaced with proper icon

  // Labels
  labels: {
    connection: 'Bağlantı',
    nickname: 'Takma İsim:',
    connect: 'BAĞLAN!',
    okClose: 'Tamam / Kapat'
  }
};

// Protection settings (Korumalar tab)
export const PROTECTION_SETTINGS = {
  title: 'Korumalar',
  settings: [
    {
      id: 'spam-protection',
      label: 'Spam Koruması',
      description: 'Spam mesajları otomatik olarak engeller',
      enabled: true
    },
    {
      id: 'flood-protection',
      label: 'Flood Koruması',
      description: 'Çok hızlı mesaj gönderimini engeller',
      enabled: true
    },
    {
      id: 'bad-word-filter',
      label: 'Kötü Kelime Filtresi',
      description: 'Uygunsuz içerikleri filtreler',
      enabled: false
    },
    {
      id: 'auto-ignore',
      label: 'Otomatik Ignore',
      description: 'Belirli kullanıcıları otomatik ignore eder',
      enabled: false
    }
  ]
};

// Settings (Ayarlar tab)
export const APP_SETTINGS = {
  title: 'Ayarlar',
  categories: [
    {
      id: 'general',
      label: 'Genel Ayarlar',
      settings: [
        { id: 'sound-enabled', label: 'Ses Efektleri', type: 'checkbox', value: true },
        { id: 'auto-join', label: 'Otomatik Katılma', type: 'checkbox', value: false },
        { id: 'show-timestamp', label: 'Zaman Damgası Göster', type: 'checkbox', value: true }
      ]
    },
    {
      id: 'display',
      label: 'Görünüm Ayarları',
      settings: [
        { id: 'font-size', label: 'Font Boyutu', type: 'select', value: 'medium', options: ['small', 'medium', 'large'] },
        { id: 'theme', label: 'Tema', type: 'select', value: 'classic', options: ['classic', 'modern', 'dark'] }
      ]
    }
  ]
};

// About (Hakkında tab)
export const ABOUT_INFO = {
  title: 'Hakkında',
  content: {
    name: 'PAPATYA V5',
    version: 'v5.0',
    website: 'http://www.sibertr.online',
    description: 'Türkiye\'nin en popüler IRC istemcisi',
    features: [
      'Gerçek zamanlı sohbet',
      'Çoklu sunucu desteği',
      'Gelişmiş koruma sistemi',
      'Özelleştirilebilir arayüz'
    ],
    copyright: '© 2024 PAPATYA Online. Tüm hakları saklıdır.'
  }
};
