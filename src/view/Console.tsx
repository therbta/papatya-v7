import React from 'react'

// Consts
import { config, formatDate } from '../const';

// Components
const Channel = React.lazy(() => import('./Channel'));
const Peer = React.lazy(() => import('./Peer'));
const LoadingMock = React.lazy(() => import('../components/LoadingMock'));

// ==============================================================================================

interface ConsoleProps {
  activeWindow: string | null;
  connected: boolean;
  currentUser?: string;
  isLoading?: boolean;
  channelChatData?: Record<string, Array<any>>;
  setChannelChatData?: React.Dispatch<React.SetStateAction<Record<string, Array<any>>>>;
  channelLoadingComplete?: Record<string, boolean>;
  setChannelLoadingComplete?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  loadingMessages?: Array<{ text: string, color: string }>;
  setLoadingMessages?: React.Dispatch<React.SetStateAction<Array<{ text: string, color: string }>>>;
  loadingComplete?: boolean;
  setLoadingComplete?: React.Dispatch<React.SetStateAction<boolean>>;
  onNicknameClick?: (nickname: string) => void;
  onNicknameSelect?: (nickname: string) => void;
}


const Console = (props: ConsoleProps) => {

  // Props
  const { activeWindow, connected, currentUser, isLoading, channelChatData, setChannelChatData, channelLoadingComplete, setChannelLoadingComplete, loadingMessages, setLoadingMessages, loadingComplete, setLoadingComplete, onNicknameClick, onNicknameSelect } = props;

  // Refs
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const userScrolledUp = React.useRef(false);

  // Cookie functions for tracking script runs
  const getScriptRunCount = (): number => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('papatya_script_runs='));
    if (cookie) {
      return parseInt(cookie.split('=')[1]) || 0;
    }
    return 0;
  };

  const incrementScriptRunCount = (): number => {
    const currentCount = getScriptRunCount();
    const newCount = currentCount + 1;
    // Set cookie with 10 year expiry
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 10);
    document.cookie = `papatya_script_runs=${newCount};expires=${expires.toUTCString()};path=/`;
    return newCount;
  };

  // Get or increment run count (only once per session)
  const [scriptRunCount] = React.useState(() => incrementScriptRunCount());

  // Opening:
  const badge = <div className='flex items-center'>
    <div style={{ width: 5, backgroundColor: '#d2d2d2' }}>&nbsp;</div>
    <div style={{ backgroundColor: '#fc1313', color: '#fff' }} className='px-1'>{config.script_name}</div>
    <div style={{ backgroundColor: '#000b7e', color: '#fff' }} className='px-1'>{config.script_version}</div>
    <div style={{ width: 5, backgroundColor: '#d2d2d2' }} className='me-1.5'>&nbsp;</div>
  </div>;

  const dashes = <div className='me-1'>
    <span style={{ color: '#ccc' }}>-</span>
    <span style={{ color: '#666' }}>-</span>
  </div>;

  const opening = [
    <div className='flex items-center'>  {dashes} {badge} Hoş Sohbetler Diler! </div>,
    <div className='flex items-center'> {dashes} Script şu ana kadar <span className="text-red-700 px-1 font-medium">{scriptRunCount}</span> kere çalıştırıldı! </div>,
    <div className='flex items-center'> {dashes} {formatDate(new Date())} </div>,
    <div className='flex items-center'> {dashes} Şu anki nickiniz: <span className="primary ps-1">{currentUser || config.root_nick}</span> </div>,
    <div className='flex items-center mb-1.5'> {dashes} Kısayol (F) tuşlarını öğrenmek için <span className="primary px-1">F12</span> tuşuna basınız. </div>,
  ];



  // Detects if user manually scrolls up
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      userScrolledUp.current = scrollTop + clientHeight < scrollHeight - 20;
    }
  };

  const ConsoleView = () => {

    return (
      <React.Fragment>
        {opening.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </React.Fragment>
    );
  }

  return (
    <div className="chats" ref={chatContainerRef} onScroll={handleScroll}>
      <div className="chat-content">

        {activeWindow === null && (
          <>
            <ConsoleView />
            {isLoading && (
              <React.Suspense fallback={null}>
                <LoadingMock
                  currentUser={currentUser || 'User452'}
                  onComplete={() => { }}
                  loadingMessages={loadingMessages || []}
                  setLoadingMessages={setLoadingMessages}
                  loadingComplete={loadingComplete || false}
                  setLoadingComplete={setLoadingComplete}
                />
              </React.Suspense>
            )}
          </>
        )}
        {activeWindow && activeWindow.startsWith('#') &&
          <React.Suspense fallback={null}>
            <Channel
              connected={connected}
              chatContainerRef={chatContainerRef}
              userScrolledUp={userScrolledUp}
              currentUser={currentUser}
              channelName={activeWindow}
              channelChatData={channelChatData?.[activeWindow] || []}
              setChannelChatData={setChannelChatData}
              channelLoadingComplete={channelLoadingComplete?.[activeWindow] || false}
              setChannelLoadingComplete={setChannelLoadingComplete}
              onNicknameClick={onNicknameClick}
              onNicknameSelect={onNicknameSelect}
            />
          </React.Suspense>
        }
        {activeWindow && !activeWindow.startsWith('#') &&
          <React.Suspense fallback={null}>
            <Peer
              connected={connected}
              chatContainerRef={chatContainerRef}
              userScrolledUp={userScrolledUp}
              currentUser={currentUser}
              peerUser={activeWindow}
              peerChatData={channelChatData?.[activeWindow] || []}
            />
          </React.Suspense>
        }

      </div>
    </div>
  );

};

export default React.memo(Console);