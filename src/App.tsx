import React from 'react'

// CSS
import './assets/styles.css';

// Components
import MenuBar from './components/MenuBar';
import Toolbar from './components/Toolbar';
import Window from './components/Window';
import PapatyaV5Dialog from './components/PapatyaV5Dialog';

// Assets
import YavuzCetinSound from './assets/sound/yavuzcetin.wav';

// Styles
import './styles/PapatyaV5Dialog.css';

// Components
const EMirc = React.lazy(() => import('./view/index'));


const App = () => {



  // States
  const [activeTab, setActiveTab] = React.useState<string | null>(null);
  const [nickname, setNickname] = React.useState<string>('');
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [showAboutModal, setShowAboutModal] = React.useState(false);
  // Ref to track if audio has been played
  const audioPlayedRef = React.useRef(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Cookie utility functions
  const setCookie = (name: string, value: string, hours: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (hours * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const shouldPlaySound = (): boolean => {
    const lastPlayed = getCookie('papatya_sound_last_played');
    if (!lastPlayed) return true;

    const lastPlayedTime = parseInt(lastPlayed);
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    return (currentTime - lastPlayedTime) >= oneHour;
  };

  React.useEffect(() => {
    // Check if sound should play based on cookie
    if (!shouldPlaySound()) {
      console.log('Sound already played within the last hour');
      setIsModalVisible(true);
      return;
    }

    // Preload audio
    audioRef.current = new Audio(YavuzCetinSound);
    audioRef.current.volume = 0.7;
    audioRef.current.load();

    // Show the original PAPATYA v5 dialog
    setIsModalVisible(true);

    // Try to play audio on ANY user interaction
    const playIntroSound = () => {
      if (audioPlayedRef.current || !audioRef.current) return;
      audioPlayedRef.current = true;

      audioRef.current.play()
        .then(() => {
          console.log('Intro sound played successfully');
          // Set cookie to track when sound was last played
          setCookie('papatya_sound_last_played', Date.now().toString(), 1); // 1 hour expiry
        })
        .catch((error) => console.log('Audio play failed:', error));

      // Remove all listeners after first play attempt
      document.removeEventListener('click', playIntroSound);
      document.removeEventListener('keydown', playIntroSound);
      document.removeEventListener('touchstart', playIntroSound);
      document.removeEventListener('mousedown', playIntroSound);
    };

    // Add multiple event listeners to catch any user interaction
    document.addEventListener('click', playIntroSound);
    document.addEventListener('keydown', playIntroSound);
    document.addEventListener('touchstart', playIntroSound);
    document.addEventListener('mousedown', playIntroSound);

    // Try autoplay immediately (might work in some browsers)
    const attemptAutoplay = async () => {
      if (audioRef.current && !audioPlayedRef.current) {
        try {
          await audioRef.current.play();
          audioPlayedRef.current = true;
          console.log('Intro sound autoplayed successfully');
          // Set cookie to track when sound was last played
          setCookie('papatya_sound_last_played', Date.now().toString(), 1); // 1 hour expiry
          // Remove listeners if autoplay worked
          document.removeEventListener('click', playIntroSound);
          document.removeEventListener('keydown', playIntroSound);
          document.removeEventListener('touchstart', playIntroSound);
          document.removeEventListener('mousedown', playIntroSound);
        } catch (error) {
          // Autoplay blocked, will wait for user interaction
          console.log('Autoplay blocked - waiting for user interaction');
        }
      }
    };

    attemptAutoplay();

    return () => {
      // Cleanup
      document.removeEventListener('click', playIntroSound);
      document.removeEventListener('keydown', playIntroSound);
      document.removeEventListener('touchstart', playIntroSound);
      document.removeEventListener('mousedown', playIntroSound);
    };
  }, []);

  // Handle connection from PAPATYA v5 dialog
  const handleConnect = (nickname: string, server: any) => {
    console.log('Connecting with:', { nickname, server });
    setNickname(nickname);
    setIsModalVisible(false);
    setActiveTab('server');
    console.log('State after connect:', { activeTab: 'server', nickname });
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsModalVisible(false);
  };


  const AboutMe = () => {
    return (
      <div className="w-full h-full flex flex-col justify-between p-4">

        <div className="flex">

          <div className="w-1/6">
            <img src="https://upload.wikimedia.org/wikipedia/en/e/e8/Mircnewlogo.png" alt="mIRC"
              style={{ maxWidth: 40, height: 'auto' }} className="rounded-lg" />
          </div>
          <div className="w-4/6 text-xs px-1.5">
            e-mIRC &copy; v1.00 <br />
            <span className="text-gray-500">Internet Relay Chat Client with React</span>

            <div className="mt-2">
              Copyright &copy; {new Date().getFullYear()} <br />
              All rights reserved.
            </div>

            <div className="mt-2">
              Written by <span className="font-medium">Baris Taskiran</span>
            </div>

          </div>

          <div className="w-1/6">
            <img src="https://avatars.githubusercontent.com/u/1035734?v=4" alt="mIRC"
              style={{ maxWidth: 60, height: 'auto' }} className="rounded-lg mx-auto" />
          </div>

        </div>

        <div className="w-full flex justify-center mt-3">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setIsModalVisible(false);
            }}>
            Close
          </button>
        </div>

      </div>
    );
  };



  return (
    <div>

      {activeTab === 'server' && nickname ? (
        <React.Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading mIRC interface...</div>}>
          <EMirc nickname={nickname} />
        </React.Suspense>
      ) : (

          <>

            <MenuBar />
            <Toolbar />

            {isModalVisible && (
              <PapatyaV5Dialog
                onConnect={handleConnect}
                onClose={handleDialogClose}
              />
            )}

            {showAboutModal && (
              <div className="fixed inset-0 flex items-center justify-center">
                <Window
                  title="About PAPATYA v7"
                  width={400}
                  height={300}
                  setIsModalVisible={setShowAboutModal}>
                  <AboutMe />
                </Window>
              </div>
            )}

        </>
      )}



    </div>
  )

}

export default React.memo(App);