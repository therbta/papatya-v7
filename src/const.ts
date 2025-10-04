
export const config = {
  root_nick: 'bLueStar',
  script_name: 'PAPATYA',
  script_version: 'v7',
  server_name: 'SiberTR IRC Network',
  server: 'irc.sibertr.online',
  root_admin: 'bLueStar',
  channels: ['str_chat', 'PAPATYA', 'Webcam']
}

export const bar = [
  { menu: 'File', submenu: ['New', 'Open', 'Save'] },
  { menu: 'View', submenu: ['Zoom In', 'Zoom Out'] },
  { menu: 'Favorites', submenu: ['Add to Favorites', 'View Favorites'] },
  { menu: 'Tools', submenu: ['Options', 'Settings'] },
  { menu: 'PAPATYA Script v7 e-mIRC', submenu: ['About', 'Help'] },
  { menu: 'Window', submenu: ['Minimize', 'Maximize'] },
  { menu: 'Help', submenu: ['Documentation', 'Support'] },
];

export const DEFAULT_CHANNELS = ['str_chat', 'PAPATYA', 'WebCam', 'Radyo', 'mIRCHane'];

export const opPriority: Record<string, number> = {
  "~": 1,
  "&": 2,
  "@": 3,
  "%": 4,
  "+": 5,
  "": 6,
};

export const op_colors = [
  { sign: "~", color: "green" },
  { sign: "&", color: "#74140c" },
  { sign: "@", color: "#ea3323" },
  { sign: "%", color: "#00007a" },
  { sign: "+", color: "#0000f2" },
];

export const formatDate = (date: Date): string => {
  const days = [
    "Pazar", "Pazartesi", "Salı", "Çarşamba",
    "Perşembe", "Cuma", "Cumartesi"
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const dayName = days[date.getDay()];

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `Tarih: ${day}/${month}/${year} ${dayName} - ${hours}:${minutes}:${seconds}`;
};

// Pure chat messages only (no join/leave events)
export const chats = [
  { "time": "02:07", "event": "chat", "message": "Bişeyi anlayamıyorum bile kafam hamura dönüyor", "user": "Contura", "new_nick": null, "email": null, "channel": null },
  { "time": "02:07", "event": "chat", "message": "Açmasan atar gider yapıyor", "user": "Contura", "new_nick": null, "email": null, "channel": null },
  { "time": "02:07", "event": "chat", "message": "Telefon", "user": "Contura", "new_nick": null, "email": null, "channel": null },
  { "time": "02:07", "event": "chat", "message": "Herşey çok çabuk eskitiliyor", "user": "Mina", "new_nick": null, "email": null, "channel": null },
  { "time": "02:08", "event": "chat", "message": "Çok çabuk değişiyor olaylar", "user": "Mina", "new_nick": null, "email": null, "channel": null },
  { "time": "02:08", "event": "nick_change", "message": "", "user": "Hazal", "new_nick": "Hazal' Away", "email": null, "channel": null },
  { "time": "02:08", "event": "chat", "message": "Maksatta bu belki", "user": "Mina", "new_nick": null, "email": null, "channel": null },
  { "time": "02:08", "event": "chat", "message": "Kafaların karışması", "user": "Mina", "new_nick": null, "email": null, "channel": null },
  { "time": "02:08", "event": "chat", "message": "yazmık ettiler bizim gibilerine senin gibilerine", "user": "Contura", "new_nick": null, "email": null, "channel": null },
  { "time": "02:09", "event": "chat", "message": "Hiç durma aynı adamla telefon görüşmesi yapılır mı", "user": "Contura", "new_nick": null, "email": null, "channel": null },
  { "time": "02:09", "event": "chat", "message": "Nasıl :)))))", "user": "Mina", "new_nick": null, "email": null, "channel": null },
  { "time": "02:09", "event": "chat", "message": "Telefon rehberinde yaklaşık 400 tane adam var 1000 de 1000'i aynı adam aramakta", "user": "Contura", "new_nick": null, "email": null, "channel": null },
  { "time": "02:09", "event": "login", "message": "", "user": "sevde", "new_nick": null, "email": "PAPATYAv7@D9.52.952D5224.sibertr.net", "channel": "#str_chat" },
  { "time": "02:09", "event": "login", "message": "", "user": "aysunn", "new_nick": null, "email": "TurkishM@25.C9.8974D62C.sibertr.net", "channel": "#str_chat" },
  { "time": "02:09", "event": "chat", "message": "Misal verdim de yani", "user": "Contura", "new_nick": null, "email": null, "channel": null },
  { "time": "02:10", "event": "chat", "message": "Yaa :)", "user": "Contura", "new_nick": null, "email": null, "channel": null },
  { "time": "02:10", "event": "login", "message": "", "user": "PAPATYAv7-439", "new_nick": null, "email": "PAPATYAv7@B0.DB.2F75F3CA.sibertr.net", "channel": "#str_chat" },
  { "time": "02:10", "event": "login", "message": "", "user": "Pokemon", "new_nick": null, "email": "PAPATYAv7@5.2E.21061F6E.sibertr.net", "channel": "#str_chat" },
  { "time": "02:10", "event": "chat", "message": "Anladım", "user": "Mina", "new_nick": null, "email": null, "channel": null },
  { "time": "02:10", "event": "quit", "message": "", "user": "Hazal' Away", "new_nick": null, "email": "PAPATYAv7@5.19.9B5EAEA4.sibertr.net", "channel": null },
  { "time": "02:10", "event": "chat", "message": "Bayan olsa da sesini duysan ama nerde duyamam", "user": "Contura", "new_nick": null, "email": null, "channel": null },
  { "time": "02:11", "event": "login", "message": "", "user": "Cokgec", "new_nick": null, "email": "PAPATYAv7@1F.8E.ECA2AA37.sibertr.net", "channel": "#str_chat" },
  { "time": "02:11", "event": "chat", "message": "Kafamızın içi yüzlerce topla dolu havada uçuşuyorlar", "user": "Mina", "new_nick": null, "email": null, "channel": null },
  { "time": "15:42", "event": "chat", "message": "Ortalık karıştı", "user": "Naren", "new_nick": null, "email": null, "channel": null },
  { "time": "15:42", "event": "chat", "message": "güzeldi", "user": "MelekSy", "new_nick": null, "email": null, "channel": null },
  { "time": "15:42", "event": "chat", "message": "Jerry ortalık aslında bi platform gibi bişi", "user": "KeeN", "new_nick": null, "email": null, "channel": null },
  { "time": "15:42", "event": "chat", "message": "Gebze", "user": "Gebze", "new_nick": null, "email": null, "channel": null },
  { "time": "15:42", "event": "chat", "message": "Meleksy hg", "user": "andaloutase", "new_nick": null, "email": null, "channel": null },
  { "time": "15:42", "event": "quit", "message": "", "user": "M33_", "new_nick": null, "email": "MobilTurki@55.6A.AB90C31D.sibertr.net", "channel": null },
  { "time": "15:42", "event": "chat", "message": "Rica", "user": "andaloutase", "new_nick": null, "email": null, "channel": null },
  { "time": "15:42", "event": "chat", "message": "ozelkapat", "user": "Esme", "new_nick": null, "email": null, "channel": null },
  { "time": "15:43", "event": "quit", "message": "", "user": "Semra560", "new_nick": null, "email": "PAPATYAv7@4E.BE.4BF22D6C.sibertr.net", "channel": null },
  { "time": "15:43", "event": "login", "message": "", "user": "EBRAR", "new_nick": null, "email": "TurkishM@58.E5.3C4CDAB7.sibertr.net", "channel": "#str_chat" },
  { "time": "15:43", "event": "chat", "message": "Öğretmen bi dişi alıcam :D", "user": "KeeN", "new_nick": null, "email": null, "channel": null },
  { "time": "15:43", "event": "chat", "message": "En doğrusu bu burda", "user": "Esme", "new_nick": null, "email": null, "channel": null },
  { "time": "15:43", "event": "chat", "message": "dışı ne ya dndjdnnd", "user": "kleopatra", "new_nick": null, "email": null, "channel": null },
  { "time": "15:43", "event": "chat", "message": "Hayırın çiftleştiriyo sanki", "user": "kleopatra", "new_nick": null, "email": null, "channel": null },
  { "time": "15:44", "event": "chat", "message": "Ciloçapatat öğretmen dişi alıcam shshshs", "user": "KeeN", "new_nick": null, "email": null, "channel": null },
  { "time": "15:44", "event": "chat", "message": "sen ne anlatıyorsun", "user": "MelekSy", "new_nick": null, "email": null, "channel": null },
  { "time": "16:30", "event": "login", "message": "", "user": "Boran", "new_nick": null, "email": "PAPATYAv7@3A.8C.F7B22134.sibertr.net", "channel": "#str_chat" },
  { "time": "16:30", "event": "chat", "message": "selam millet neler donuyor", "user": "Boran", "new_nick": null, "email": null, "channel": null },
  { "time": "16:30", "event": "chat", "message": "hosgeldin boran sakin buralar", "user": "Eylul", "new_nick": null, "email": null, "channel": null },
  { "time": "16:31", "event": "chat", "message": "birkac kisi vardi az once ama dagildilar", "user": "Eren_57", "new_nick": null, "email": null, "channel": null },
  { "time": "16:31", "event": "chat", "message": "bugun cok sessiz ya eskiden boyle degildi", "user": "Boran", "new_nick": null, "email": null, "channel": null },
  { "time": "16:32", "event": "login", "message": "", "user": "Zehra", "new_nick": null, "email": "PAPATYAv7@5D.9F.2A3E451B.sibertr.net", "channel": "#str_chat" },
  { "time": "16:32", "event": "chat", "message": "selam herkese", "user": "Zehra", "new_nick": null, "email": null, "channel": null },
  { "time": "16:32", "event": "chat", "message": "merhaba zehra hosgeldin", "user": "Eylul", "new_nick": null, "email": null, "channel": null },
  { "time": "16:33", "event": "chat", "message": "hosbulduk bugun neler konustunuz", "user": "Zehra", "new_nick": null, "email": null, "channel": null },
  { "time": "16:33", "event": "chat", "message": "pek bi sey yok sessizdi burasi", "user": "Eren_57", "new_nick": null, "email": null, "channel": null },
  { "time": "16:34", "event": "chat", "message": "neyse biraz hareket getirelim su an ne yapiyorsunuz", "user": "Zehra", "new_nick": null, "email": null, "channel": null },
  { "time": "16:34", "event": "chat", "message": "ben netflixe bakiyordum ama sikildim biraz", "user": "Boran", "new_nick": null, "email": null, "channel": null },
  { "time": "16:35", "event": "chat", "message": "ben de muzik dinliyorum yeni bir playlist yaptim", "user": "Eylul", "new_nick": null, "email": null, "channel": null },
  { "time": "16:35", "event": "quit", "message": "", "user": "Eren_57", "new_nick": null, "email": "PAPATYAv7@2B.6A.1E4D894A.sibertr.net", "channel": null },
  { "time": "16:35", "event": "chat", "message": "eren gitti sanirim", "user": "Zehra", "new_nick": null, "email": null, "channel": null },
  { "time": "16:36", "event": "chat", "message": "evet ya sessizce kacti", "user": "Eylul", "new_nick": null, "email": null, "channel": null },
  { "time": "16:37", "event": "login", "message": "", "user": "OmerCan", "new_nick": null, "email": "PAPATYAv7@7E.88.3D221A5B.sibertr.net", "channel": "#str_chat" },
  { "time": "16:37", "event": "chat", "message": "selam dostlar ne yapiyorsunuz", "user": "OmerCan", "new_nick": null, "email": null, "channel": null },
  { "time": "16:37", "event": "chat", "message": "hosgeldin omercan cok bi sey yok muhabbet ediyoruz", "user": "Boran", "new_nick": null, "email": null, "channel": null },
  { "time": "16:38", "event": "chat", "message": "guzel guzel ben de katilayim", "user": "OmerCan", "new_nick": null, "email": null, "channel": null },
  { "time": "16:38", "event": "nick_change", "message": "", "user": "Eylul", "new_nick": "Eylul_99", "email": null, "channel": null },
  { "time": "16:39", "event": "chat", "message": "aaa eylul ismini degistirdi", "user": "Zehra", "new_nick": null, "email": null, "channel": null },
  { "time": "16:39", "event": "chat", "message": "evet ya biraz degisiklik olsun dedim", "user": "Eylul_99", "new_nick": null, "email": null, "channel": null },
  { "time": "16:40", "event": "quit", "message": "", "user": "Boran", "new_nick": null, "email": "PAPATYAv7@3A.8C.F7B22134.sibertr.net", "channel": null },
  { "time": "16:40", "event": "chat", "message": "boran da gitti sanirim", "user": "OmerCan", "new_nick": null, "email": null, "channel": null },
  { "time": "16:41", "event": "chat", "message": "evet yine az kaldik", "user": "Eylul_99", "new_nick": null, "email": null, "channel": null },
  { "time": "16:42", "event": "login", "message": "", "user": "Mert_", "new_nick": null, "email": "PAPATYAv7@4D.73.A6F5D122.sibertr.net", "channel": "#str_chat" },
  { "time": "16:42", "event": "chat", "message": "Selam millet, kaçırdığım bir şey var mı?", "user": "Mert_", "new_nick": null, "email": null, "channel": null },
  { "time": "18:20", "event": "login", "message": "", "user": "melis_", "new_nick": null, "email": "PAPATYAv7@6F.2D.9B7C1123.sibertr.net", "channel": "#str_chat" },
  { "time": "18:20", "event": "chat", "message": "slm kimler var?", "user": "melis_", "new_nick": null, "email": null, "channel": null },
  { "time": "18:21", "event": "chat", "message": "heeey melisss naber :))", "user": "irem34", "new_nick": null, "email": null, "channel": null },
  { "time": "18:21", "event": "chat", "message": "heyy iremm, iyiii iştee sennn??", "user": "melis_", "new_nick": null, "email": null, "channel": null },
  { "time": "18:22", "event": "chat", "message": "ayyyy napim ya iş güç işte klasik", "user": "irem34", "new_nick": null, "email": null, "channel": null },
  { "time": "18:22", "event": "chat", "message": "aynen ya, bende sabahtan beri ders çalışıyom kafam yandı sdfds", "user": "melis_", "new_nick": null, "email": null, "channel": null },
  { "time": "18:23", "event": "login", "message": "", "user": "nisa_98", "new_nick": null, "email": "PAPATYAv7@7E.88.3D221A5B.sibertr.net", "channel": "#str_chat" },
  { "time": "18:23", "event": "chat", "message": "selam kızlar ne anlatıyonuzz :p", "user": "nisa_98", "new_nick": null, "email": null, "channel": null },
  { "time": "18:24", "event": "chat", "message": "ayy nisaaa geldii :D", "user": "melis_", "new_nick": null, "email": null, "channel": null },
  { "time": "18:24", "event": "chat", "message": "günahımı anlatıyorum :P sdfgfdg", "user": "irem34", "new_nick": null, "email": null, "channel": null },
  { "time": "18:25", "event": "chat", "message": "yok yaa ben de çok sıkıldm napalım ya :(", "user": "nisa_98", "new_nick": null, "email": null, "channel": null },
  { "time": "18:25", "event": "chat", "message": "dizi önerin kankiler ben açıyım bari", "user": "nisa_98", "new_nick": null, "email": null, "channel": null },
  { "time": "18:26", "event": "chat", "message": "ay şu an netflixe bakan bi tek ben değilim dmi sdfgsdfg", "user": "melis_", "new_nick": null, "email": null, "channel": null },
  { "time": "18:26", "event": "chat", "message": "sjsjsjs aynen yaaa", "user": "irem34", "new_nick": null, "email": null, "channel": null },
  { "time": "18:27", "event": "quit", "message": "", "user": "irem34", "new_nick": null, "email": "PAPATYAv7@2B.6A.1E4D894A.sibertr.net", "channel": null },
  { "time": "18:27", "event": "chat", "message": "irem çıktı yaa kaldık başbaşa sdfsd", "user": "melis_", "new_nick": null, "email": null, "channel": null },
  { "time": "18:28", "event": "chat", "message": "napcaz kız kısır falan mı yoğurak sdfgdfg", "user": "nisa_98", "new_nick": null, "email": null, "channel": null },
  { "time": "18:29", "event": "login", "message": "", "user": "eda_", "new_nick": null, "email": "PAPATYAv7@5E.4D.8C56B7E3.sibertr.net", "channel": "#str_chat" },
  { "time": "18:29", "event": "chat", "message": "meraba bu oda aktif mi :D", "user": "eda_", "new_nick": null, "email": null, "channel": null },
  { "time": "18:29", "event": "chat", "message": "aktifiz şekerim hoşgeldin xd", "user": "melis_", "new_nick": null, "email": null, "channel": null },
  { "time": "18:30", "event": "chat", "message": "saol cnmm neler dönüyo :)", "user": "eda_", "new_nick": null, "email": null, "channel": null },
  { "time": "18:30", "event": "chat", "message": "dedikodu tabii ne olcak sdfgdfg", "user": "nisa_98", "new_nick": null, "email": null, "channel": null },
  { "time": "18:31", "event": "chat", "message": "ay canım yaa ben de biraz oturuyum burda", "user": "eda_", "new_nick": null, "email": null, "channel": null },
  { "time": "18:32", "event": "nick_change", "message": "", "user": "melis_", "new_nick": "meloshhh", "email": null, "channel": null },
  { "time": "18:32", "event": "chat", "message": "ayy bi değişiklik olsun dedim sdfsdg", "user": "meloshhh", "new_nick": null, "email": null, "channel": null },
  { "time": "18:33", "event": "quit", "message": "", "user": "nisa_98", "new_nick": null, "email": "PAPATYAv7@3A.8C.F7B22134.sibertr.net", "channel": null },
  { "time": "18:33", "event": "chat", "message": "yine eksildik ya sdfsd", "user": "eda_", "new_nick": null, "email": null, "channel": null },
  { "time": "18:34", "event": "chat", "message": "yok ya ben de kapatıcam azdan", "user": "meloshhh", "new_nick": null, "email": null, "channel": null },
  { "time": "18:35", "event": "quit", "message": "", "user": "meloshhh", "new_nick": null, "email": "PAPATYAv7@6F.2D.9B7C1123.sibertr.net", "channel": null },
  { "time": "18:36", "event": "chat", "message": "tek kaldım :)", "user": "eda_", "new_nick": null, "email": null, "channel": null },

]


// Mock chat data for PAPATYA channel
export const papatyaChats = [
  { "time": "14:15", "event": "chat", "message": "selam papatya ailesi bugun nasilsiniz", "user": "BoRaN", "new_nick": null, "email": null, "channel": null },
  { "time": "14:16", "event": "chat", "message": "selam bora iyiyiz sen nasilsin", "user": "KartaL", "new_nick": null, "email": null, "channel": null },
  { "time": "14:17", "event": "chat", "message": "iyi iyi yeni uyelerimizi tanilalim mi", "user": "BoRaN", "new_nick": null, "email": null, "channel": null },
  { "time": "14:18", "event": "login", "message": "", "user": "Emrehan", "new_nick": null, "email": "PAPATYAv7@4A.2B.1C3D456E.sibertr.net", "channel": "#PAPATYA" },
  { "time": "14:18", "event": "chat", "message": "hosgeldin emrehan papatyaya katildigin icin tesekkurler", "user": "KartaL", "new_nick": null, "email": null, "channel": null },
  { "time": "14:19", "event": "chat", "message": "tesekkurler burayi cok begendim", "user": "Emrehan", "new_nick": null, "email": null, "channel": null },
  { "time": "14:20", "event": "chat", "message": "bu hafta sunucu guncellemeleri hakkinda bilgi verebilir miyiz", "user": "BoRaN", "new_nick": null, "email": null, "channel": null },
  { "time": "14:21", "event": "chat", "message": "tabii yeni ozellikler ve guvenlik guncellemeleri geliyor", "user": "HyTecH", "new_nick": null, "email": null, "channel": null },
  { "time": "14:22", "event": "login", "message": "", "user": "Fikret", "new_nick": null, "email": "PAPATYAv7@7E.9F.2A1B3C4D.sibertr.net", "channel": "#PAPATYA" },
  { "time": "14:23", "event": "chat", "message": "fikret uzun zamandir yoktun hosgeldin", "user": "KartaL", "new_nick": null, "email": null, "channel": null },
  { "time": "14:24", "event": "chat", "message": "evet ya is yogunlugu vardi simdi daha aktif olacagim", "user": "Fikret", "new_nick": null, "email": null, "channel": null },
  { "time": "14:25", "event": "chat", "message": "guzel bu arada yeni kurallarimiz var bir goz atmani oneririm", "user": "BoRaN", "new_nick": null, "email": null, "channel": null },
  { "time": "14:26", "event": "chat", "message": "tabii hemen bakacagim saygili davranis konusunda sorun yok", "user": "Fikret", "new_nick": null, "email": null, "channel": null },
  { "time": "14:27", "event": "chat", "message": "mukemmel bu yuzden papatya ailesi olarak boyle guzel bir ortamimiz var", "user": "KartaL", "new_nick": null, "email": null, "channel": null },
  { "time": "14:28", "event": "chat", "message": "bu hafta sonu etkinlik var mi", "user": "Emrehan", "new_nick": null, "email": null, "channel": null },
  { "time": "14:29", "event": "chat", "message": "evet cumartesi aksami buyuk sohbet etkinligimiz var", "user": "Supervisor", "new_nick": null, "email": null, "channel": null },
  { "time": "14:30", "event": "chat", "message": "harika katilacagim kesinlikle", "user": "Fikret", "new_nick": null, "email": null, "channel": null },
  { "time": "14:31", "event": "quit", "message": "", "user": "HyTecH", "new_nick": null, "email": "PAPATYAv7@3F.5A.8B2C4D6E.sibertr.net", "channel": null },
  { "time": "14:32", "event": "chat", "message": "hytech gitti muhtemelen sunucu bakimina basladi", "user": "BoRaN", "new_nick": null, "email": null, "channel": null },
  { "time": "14:33", "event": "chat", "message": "bu arada yeni uyelerimize ozel hediyelerimiz var", "user": "KartaL", "new_nick": null, "email": null, "channel": null },
  { "time": "14:34", "event": "chat", "message": "ne tur hediyeler bunlar cok merak ettim", "user": "Emrehan", "new_nick": null, "email": null, "channel": null },
  { "time": "14:35", "event": "chat", "message": "ozel ranklar renkli nickler ve daha fazlasi", "user": "Supervisor", "new_nick": null, "email": null, "channel": null },
  { "time": "14:36", "event": "login", "message": "", "user": "Kerem", "new_nick": null, "email": "PAPATYAv7@6D.8E.9F1A2B3C.sibertr.net", "channel": "#PAPATYA" },
  { "time": "14:37", "event": "chat", "message": "selam kerem moderatorluk nasil gidiyor", "user": "BoRaN", "new_nick": null, "email": null, "channel": null },
  { "time": "14:38", "event": "chat", "message": "iyi gidiyor topluluk gercekten saygili ve guzel", "user": "Kerem", "new_nick": null, "email": null, "channel": null },
  { "time": "14:39", "event": "chat", "message": "bu papatyanin en guzel yani zaten herkes birbirine saygili", "user": "Fikret", "new_nick": null, "email": null, "channel": null },
  { "time": "14:40", "event": "chat", "message": "kesinlikle bu yuzden burada olmaktan gurur duyuyorum", "user": "Emrehan", "new_nick": null, "email": null, "channel": null },
  { "time": "14:41", "event": "nick_change", "message": "", "user": "Emrehan", "new_nick": "Eyluls", "email": null, "channel": null },
  { "time": "14:42", "event": "chat", "message": "aaa isim degistirdin eyluls guzel olmus", "user": "KartaL", "new_nick": null, "email": null, "channel": null },
  { "time": "14:43", "event": "chat", "message": "evet burayi cok sevdigim icin boyle yaptim", "user": "Eyluls", "new_nick": null, "email": null, "channel": null },
  { "time": "14:44", "event": "chat", "message": "cok guzel bu tur guzel davranislar papatyayi ozel kiliyor", "user": "BoRaN", "new_nick": null, "email": null, "channel": null }
];

// Mock chat data for Webcam channel
export const webcamChats = [
  { "time": "16:20", "event": "chat", "message": "selam webcam kanali bugun kimler kamerayi acacak", "user": "Gece", "new_nick": null, "email": null, "channel": null },
  { "time": "16:21", "event": "login", "message": "", "user": "Güzel_Kiz_23", "new_nick": null, "email": "PAPATYAv7@2A.4B.6C8D9E0F.sibertr.net", "channel": "#Webcam" },
  { "time": "16:22", "event": "chat", "message": "selam ben kamerami acabilirim", "user": "Güzel_Kiz_23", "new_nick": null, "email": null, "channel": null },
  { "time": "16:23", "event": "chat", "message": "harika guzel kiz kamerayi aciyor baskalari da katilabilir", "user": "Gece", "new_nick": null, "email": null, "channel": null },
  { "time": "16:24", "event": "login", "message": "", "user": "Yakışıklı_Erkek", "new_nick": null, "email": "PAPATYAv7@5E.7F.1A2B3C4D.sibertr.net", "channel": "#Webcam" },
  { "time": "16:25", "event": "chat", "message": "selam ben de katilabilir miyim", "user": "Yakışıklı_Erkek", "new_nick": null, "email": null, "channel": null },
  { "time": "16:26", "event": "chat", "message": "tabii ki hosgeldin yakisikli erkek", "user": "Gece", "new_nick": null, "email": null, "channel": null },
  { "time": "16:27", "event": "chat", "message": "bu aksam ne yapiyoruz grup sohbet mi", "user": "Güzel_Kiz_23", "new_nick": null, "email": null, "channel": null },
  { "time": "16:28", "event": "chat", "message": "evet grup sohbet yapabiliriz herkes kendi kamerayi acabilir", "user": "Yakışıklı_Erkek", "new_nick": null, "email": null, "channel": null },
  { "time": "16:29", "event": "login", "message": "", "user": "Sevimli_Kedi", "new_nick": null, "email": "PAPATYAv7@8C.9D.0E1F2A3B.sibertr.net", "channel": "#Webcam" },
  { "time": "16:30", "event": "chat", "message": "merhaba ben de katilayim mi", "user": "Sevimli_Kedi", "new_nick": null, "email": null, "channel": null },
  { "time": "16:31", "event": "chat", "message": "tabii sevimli kedi hosgeldin", "user": "Güzel_Kiz_23", "new_nick": null, "email": null, "channel": null },
  { "time": "16:32", "event": "chat", "message": "kac kisiyiz su an hepsini gorebilir miyiz", "user": "Yakışıklı_Erkek", "new_nick": null, "email": null, "channel": null },
  { "time": "16:33", "event": "chat", "message": "su an 3 kisiiz daha fazla kisi katilabilir", "user": "Gece", "new_nick": null, "email": null, "channel": null },
  { "time": "16:34", "event": "chat", "message": "ben kamerami actim goruyor musunuz", "user": "Güzel_Kiz_23", "new_nick": null, "email": null, "channel": null },
  { "time": "16:35", "event": "chat", "message": "evet goruyorum cok guzel gorunuyorsun", "user": "Yakışıklı_Erkek", "new_nick": null, "email": null, "channel": null },
  { "time": "16:36", "event": "chat", "message": "tesekkurler sen de ac bakalim", "user": "Güzel_Kiz_23", "new_nick": null, "email": null, "channel": null },
  { "time": "16:37", "event": "chat", "message": "tamam ben de aciyorum sevimli kedi sen de katil", "user": "Yakışıklı_Erkek", "new_nick": null, "email": null, "channel": null },
  { "time": "16:38", "event": "chat", "message": "ben de aciyorum merak ediyorum nasil gorunuyorum", "user": "Sevimli_Kedi", "new_nick": null, "email": null, "channel": null },
  { "time": "16:39", "event": "login", "message": "", "user": "Sohbet_Adam", "new_nick": null, "email": "PAPATYAv7@3B.5C.7D8E9F0A.sibertr.net", "channel": "#Webcam" },
  { "time": "16:40", "event": "chat", "message": "selam bu kanalda ne yapiliyor", "user": "Sohbet_Adam", "new_nick": null, "email": null, "channel": null },
  { "time": "16:41", "event": "chat", "message": "webcam sohbeti yapiyoruz katilmak ister misin", "user": "Gece", "new_nick": null, "email": null, "channel": null },
  { "time": "16:42", "event": "chat", "message": "tabii ben de kamerami acabilirim", "user": "Sohbet_Adam", "new_nick": null, "email": null, "channel": null },
  { "time": "16:43", "event": "chat", "message": "harika simdi 4 kisiiz herkes guzel gorunuyor", "user": "Güzel_Kiz_23", "new_nick": null, "email": null, "channel": null },
  { "time": "16:44", "event": "chat", "message": "bu aksam cok eglenceli geciyor tesekkurler herkese", "user": "Sevimli_Kedi", "new_nick": null, "email": null, "channel": null },
  { "time": "16:45", "event": "chat", "message": "evet ya guzel bir grup olduk duzenli bulusalim boyle", "user": "Yakışıklı_Erkek", "new_nick": null, "email": null, "channel": null },
  { "time": "16:46", "event": "quit", "message": "", "user": "Sohbet_Adam", "new_nick": null, "email": "PAPATYAv7@3B.5C.7D8E9F0A.sibertr.net", "channel": null },
  { "time": "16:47", "event": "chat", "message": "sohbet adam gitti devam edelim mi", "user": "Güzel_Kiz_23", "new_nick": null, "email": null, "channel": null },
  { "time": "16:48", "event": "chat", "message": "tabii devam edelim bu cok eglenceli", "user": "Sevimli_Kedi", "new_nick": null, "email": null, "channel": null },
  { "time": "16:49", "event": "chat", "message": "bu kanali cok seviyorum insanlarla tanismak guzel", "user": "Yakışıklı_Erkek", "new_nick": null, "email": null, "channel": null },
  { "time": "16:50", "event": "chat", "message": "ben de papatyanin en guzel kanallarindan biri bu", "user": "Güzel_Kiz_23", "new_nick": null, "email": null, "channel": null }
];

export const nicknames = [
  { "nick": "bLueStar", "op": "~" },
  { "nick": "SiyahLeo", "op": "&" },
  { "nick": "NiGDe", "op": "&" },
  { "nick": "esmerim_23", "op": "&" },
  { "nick": "DuZCe", "op": "&" },
  { "nick": "Diablo", "op": "@" },
  { "nick": "CharGer", "op": "@" },
  { "nick": "Antik", "op": "@" },
  { "nick": "AseLina", "op": "@" },
  { "nick": "AsiPrens", "op": "@" },
  { "nick": "aXxxi", "op": "%" },
  { "nick": "ay_ca_", "op": "%" },
  { "nick": "aynur_", "op": "%" },
  { "nick": "AzRaiL", "op": "%" },
  { "nick": "Astsubay-Murat_", "op": "+" },
  { "nick": "Astsubay07", "op": "+" },
  { "nick": "Avukat_Akin", "op": "+" },
  { "nick": "AVUKAT_CEM06", "op": "+" },
  { "nick": "Avukat_Hakan", "op": "+" },
  { "nick": "Bahar001", "op": "" },
  { "nick": "bakkalamcan_M_", "op": "" },
  { "nick": "banderas34", "op": "" },
  { "nick": "barbiee", "op": "" },
  { "nick": "BARUT_", "op": "" },
  { "nick": "Batur", "op": "" },
  { "nick": "Bay_Seviyeli", "op": "" },
  { "nick": "BenDenizi", "op": "" },
  { "nick": "Beria", "op": "" },
  { "nick": "BERK33", "op": "" },
  { "nick": "berke_18", "op": "" },
  { "nick": "beste1213", "op": "" },
  { "nick": "beyciKo", "op": "" },
  { "nick": "billa", "op": "" },
  { "nick": "birisiA", "op": "" },
  { "nick": "BlehkD", "op": "" },
  { "nick": "bodrum_buse", "op": "" },
  { "nick": "BordoMavi61", "op": "" },
  { "nick": "BoşnakHakan", "op": "" },
  { "nick": "BRHM", "op": "" },
  { "nick": "brs42", "op": "" },
  { "nick": "Burak", "op": "" },
  { "nick": "Burhan1", "op": "" },
  { "nick": "Burhan1817", "op": "" },
  { "nick": "bursa_oguz44", "op": "" },
  { "nick": "busenur", "op": "" },
  { "nick": "byhard28", "op": "" },
  { "nick": "Börü", "op": "" },
  { "nick": "CafeiN", "op": "" },
  { "nick": "Cagkan_ist", "op": "" },
  { "nick": "canakkalemrkz", "op": "" },
  { "nick": "cemal_sahin", "op": "" },
  { "nick": "Ceren", "op": "" },
  { "nick": "CEYHUN_ist", "op": "" },
  { "nick": "Cha", "op": "" },
  { "nick": "Chesster34", "op": "" },
  { "nick": "ciddi_muhendis_TuRaB", "op": "" },
  { "nick": "Cinoo", "op": "" },
  { "nick": "ClubUser-459", "op": "" },
  { "nick": "CoLantiS", "op": "" },
  { "nick": "Dalton", "op": "" },
  { "nick": "DamLa", "op": "" },
  { "nick": "Deli_Seyyah", "op": "" },
  { "nick": "delifişek", "op": "" },
  { "nick": "deLy", "op": "" },
  { "nick": "demir_istan30", "op": "" },
  { "nick": "DesigneR", "op": "" },
  { "nick": "Dilan_ogrenci_konya", "op": "" },
  { "nick": "diyarbkr_", "op": "" },
  { "nick": "DOKTOR36_", "op": "" },
  { "nick": "dR_akdamara", "op": "" },
  { "nick": "DR_CIVAN", "op": "" },
  { "nick": "dr_ist34", "op": "" },
  { "nick": "DYRBAKIR30", "op": "" },
  { "nick": "EDNBULUR86", "op": "" },
  { "nick": "egemen_67", "op": "" },
  { "nick": "elitBirAdam", "op": "" },
  { "nick": "emir_34", "op": "" },
  { "nick": "emre_33", "op": "" },
  { "nick": "Emreee__", "op": "" },
  { "nick": "EniS", "op": "" },
  { "nick": "ERTUGRUList41", "op": "" },
  { "nick": "ethercity", "op": "" },
  { "nick": "Evet", "op": "" },
  { "nick": "Famiredo", "op": "" },
  { "nick": "FaRiD", "op": "" },
  { "nick": "Fearless", "op": "" },
  { "nick": "FirLama", "op": "" },
  { "nick": "Fundaa", "op": "" },
  { "nick": "gillidaran", "op": "" },
  { "nick": "Gizemm24", "op": "" },
  { "nick": "Godlessturtle", "op": "" },
  { "nick": "GoLBaSiLi", "op": "" },
  { "nick": "GoodGuy", "op": "" },
  { "nick": "Guest886145222", "op": "" },
  { "nick": "Huzurr", "op": "" }
];

// Function to extract unique users from chat data
export const extractUsersFromChatData = (chatData: any[]): Array<{ nick: string, op: string }> => {
  const users = new Set<string>();

  chatData.forEach(chat => {
    if (chat.user && chat.user.trim()) {
      users.add(chat.user);
    }
  });

  // Convert to array and assign appropriate op levels
  return Array.from(users).map(user => {
    // Assign op levels based on user roles
    let op = '';
    if (user === 'bLueStar' || user === 'BoRaN') {
      op = '~'; // Admin/Owner
    } else if (user === 'KartaL' || user === 'Kerem' || user === 'Gece') {
      op = '@'; // Moderator
    } else if (user === 'HyTecH' || user === 'Supervisor') {
      op = '+'; // Voice/Support
    }

    return { nick: user, op };
  });
};
