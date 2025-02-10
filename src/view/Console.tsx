import React from 'react'

// Consts
import { config, formatDate } from '../const';

// Components
const Channel = React.lazy(() => import('./Channel'));
const Peer = React.lazy(() => import('./Peer'));

// ==============================================================================================

interface ConsoleProps {
  activeWindow: string | null;
  connected: boolean;
}


const Console = (props: ConsoleProps) => {

  // Props
  const { activeWindow, connected } = props;

  // Refs
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const userScrolledUp = React.useRef(false);

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
    <div className='flex items-center'> {dashes} Script şu ana kadar <span className="text-red-700 px-1 font-medium">2</span> kere çalıştırıldı! </div>,
    <div className='flex items-center'> {dashes} {formatDate(new Date())} </div>,
    <div className='flex items-center'> {dashes} Şu anki nickiniz: <span className="primary ps-1">{config.root_nick}</span> </div>,
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

        {activeWindow === null && <ConsoleView />}
        {activeWindow &&
          <React.Suspense fallback={null}>
            <Channel
              connected={connected}
              chatContainerRef={chatContainerRef}
              userScrolledUp={userScrolledUp}
            />
          </React.Suspense>
        }

      </div>
    </div>
  );

};

export default React.memo(Console);