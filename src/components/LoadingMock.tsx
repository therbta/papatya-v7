import React from 'react';
import { config } from '../const';

interface LoadingMockProps {
  currentUser: string;
  onComplete: () => void;
  loadingMessages?: Array<{ text: string, color: string }>;
  setLoadingMessages?: React.Dispatch<React.SetStateAction<Array<{ text: string, color: string }>>>;
  loadingComplete?: boolean;
  setLoadingComplete?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingMock: React.FC<LoadingMockProps> = ({ currentUser, onComplete, loadingMessages: externalMessages, setLoadingMessages: setExternalMessages, loadingComplete: externalComplete, setLoadingComplete: setExternalComplete }) => {
  const [localMessages, setLocalMessages] = React.useState<Array<{ text: string, color: string }>>([]);
  const [currentStep, setCurrentStep] = React.useState(0);

  // Use external state if provided, otherwise use local state
  const loadingMessages = externalMessages || localMessages;
  const setLoadingMessages = setExternalMessages || setLocalMessages;

  const loadingSequence = [
    { text: `[16:10]* Connecting to ${config.server} (6667)`, color: '#4f94f3' },
    { text: `[16:10] * Unable to resolve server`, color: '#4f94f3' },
    { text: `[16:10] * Connect cancelled`, color: '#4f94f3' },
    { text: `[16:10] * Connecting to ${config.server} (6667)`, color: '#4f94f3' },
    { text: `[16:10] Ping? Pong!`, color: '#00ff00' },
    { text: `[16:10] [IRC VERSION]`, color: '#4f94f3' },
    { text: `[16:10] -> [IRC] VERSION PAPATYA mIRC v5 by bLackStar`, color: '#4f94f3' },
    { text: `Hoşgeldin ${currentUser}!PAPATYAv5@174.226.62.165`, color: '#4f94f3' },
    { text: `Server versionu: Unreal3.2.10.7`, color: '#4f94f3' },
    { text: `Server Kuruluş Tarihi: Sun Oct 21 Sun 02:44:51`, color: '#4f94f3' },
    { text: `Sunucu Adı: ${config.server} Çalışan Version: Unreal3.2.10.7`, color: '#4f94f3' },
    { text: `Server bilgi: MAXLIST=b:360,e:360,l:360 NICKLEN=30 CHANNELLEN=32 MAXLIST=b:360,e:360,l:360 KICKLEN=400`, color: '#4f94f3' },
    { text: `Server bilgi: PREFIX=(qaohv).&@%+ CHANMODES=bel,kfL,lj,psmntirRcOAQKVCuzNSMTGYZ NETWORK=Sohbet.Net PREFIX=(qaohv).&@%+ EXTBAN=~,qjncrRaT`, color: '#4f94f3' },
    { text: `Server bilgi: this server this`, color: '#4f94f3' },
    { text: `Toplam kullanıcı sayısı: 5`, color: '#4f94f3' },
    { text: `IRC'de olan IRCop sayısı: 3`, color: '#4f94f3' },
    { text: `Aktif kanal sayısı: 120`, color: '#4f94f3' },
    { text: `Alıcılar 49 tane - Yerel kullanıcılar 1 tane.`, color: '#4f94f3' },
    { text: `Current local users 49, max 2835`, color: '#4f94f3' },
    { text: `Current global users 471, max 594`, color: '#4f94f3' },
    { text: `«[ Server Motd Başlangıcı ]»`, color: '#4f94f3' },
    { text: `[16:10] -${config.server}-*** Güvenlik taramalarından geçiyorsunuz. Lütfen 5 saniye bekleyiniz.`, color: '#4f94f3' },
    { text: `[16:10] * ${currentUser} sets mode: +iwxG`, color: '#4f94f3' },
    { text: `III SiberTR.Net`, color: '#4f94f3' },
    { text: `III NickServ En son kayıt edilen nick: TokioHotel`, color: '#4f94f3' },
    { text: `III ChanServ En son kayıt edilen kanal: #Oxm`, color: '#4f94f3' },
    { text: `III SiberTR.Net`, color: '#4f94f3' },
    { text: `III SiberTR.Net [Duyurular - Agu 27 2022] IRCop-Admin veya Global Kanal Founderi Olmanın Farklılığı ve Avantajlarından Sizlerde yararlanmak istiyorsanız #SALES kanalındaki yetkililer ile görüşebilir avantajlı kampanyalarımız hakkında bilgi alabilirsiniz.`, color: '#4f94f3' },
    { text: `III SiberTR.Net [Duyurular - Agu 27 2022] Değerli kullanıcılarımız Nick Rumuz kullanıcı adı işlemi kayıt sonrasında tanıtım kodu konusunda destek almak için #OperHelp ve #NickServ Kanallarından destek alabilirsiniz.`, color: '#4f94f3' },
    { text: `III NickServ Merhaba ${currentUser}, nickiniz kayıtlı değildir.`, color: '#4f94f3' },
    { text: `III NickServ Nick kayıt etmek için /ns register şifre e-mail adresiniz komutunu kullanabilirsiniz.`, color: '#4f94f3' },
    { text: `III SiberTR.Net Servislerdeki Değişimleri Görmek için:/services REFORM Komutunu Uygulayınız.`, color: '#4f94f3' },
    { text: `[16:10] Local host: 165.sub-174-226-62.myvzw.com (174.226.62.165)`, color: '#4f94f3' },
    { text: `[16:10] -${config.server}- Can not join #PAPATYA: Özel Kanal Açamazsınız. #Sohbet kanalına yönlendiriliyorsunuz.`, color: '#4f94f3' },
    { text: `[16:10] -${config.server}-*** Redirecting you to #Sohbet`, color: '#4f94f3' },
    { text: `[16:10] -${config.server}-*** Güvenlik nedeni ile giriş yapamadınız. Lütfen 4 saniye bekleyiniz.`, color: '#4f94f3' },
    { text: `[16:10] -${config.server}- Can not join #WebCam: Özel Kanal Açamazsınız. #Sohbet kanalına yönlendiriliyorsunuz.`, color: '#4f94f3' },
    { text: `[16:10] -${config.server}- Redirecting you to #Sohbet`, color: '#4f94f3' },
    { text: `[16:10] -${config.server}- Güvenlik nedeni ile giriş yapamadınız. Lütfen 4 saniye bekleyiniz.`, color: '#4f94f3' },
    { text: `[16:10] -${config.server}- Can not join #PAPATYA: Özel Kanal Açamazsınız. #Sohbet kanalına yönlendiriliyorsunuz.`, color: '#4f94f3' }
  ];

  React.useEffect(() => {
    // Only load if we haven't loaded yet (check external messages)
    if (externalMessages && externalMessages.length > 0) {
      // Already loaded, don't restart
      return;
    }

    if (currentStep < loadingSequence.length) {
      const delay = currentStep === 0 ? 100 : Math.random() * 150 + 50; // 50-200ms between messages

      const timer = setTimeout(() => {
        setLoadingMessages(prev => [...prev, loadingSequence[currentStep]]);
        setCurrentStep(prev => prev + 1);

        // Mark as complete after last message
        if (currentStep === loadingSequence.length - 1 && setExternalComplete) {
          setExternalComplete(true);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
    // Don't call onComplete - keep messages visible
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  return (
    <div className="loading-mock">
      {loadingMessages.map((message, index) => (
        <div
          key={index}
          className="loading-message"
          style={{ color: message.color }}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default LoadingMock;
