import React, { JSX } from 'react'

// Consts
import { chats, config, formatDate } from '../const';


const Console: React.FC = () => {


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

  const [displayedChats, setDisplayedChats] = React.useState<typeof chats>([]);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const userScrolledUp = React.useRef(false);

  React.useEffect(() => {
    let delay = 100; // Quick debug delay
    let isMounted = true;

    chats.forEach((chat: any) => {
      setTimeout(() => {
        if (isMounted) {
          setDisplayedChats((prevChats) =>
            prevChats.some(c => c.time === chat.time && c.user === chat.user)
              ? prevChats
              : [...prevChats, { ...chat, time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) }]
          );

          if (chatContainerRef.current && !userScrolledUp.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }
      }, delay);

      delay += Math.random() * 1000 + 300;

    });

    return () => {
      isMounted = false;
    };
  }, []);


  // Detects if user manually scrolls up
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      userScrolledUp.current = scrollTop + clientHeight < scrollHeight - 20;
    }
  };

  const Chats = () => {

    return (
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <div style={{ marginTop: "auto" }}>
          {displayedChats.map((chat, index) => {
            const { time, event, message, user, new_nick, email, channel } = chat;

            let row: JSX.Element | null = null;

            if (event === "login") {
              row = (
                <span style={{ color: "#129393" }}>
                  *** Giriş: {user} ({email}) {channel}
                </span>
              );
            } else if (event === "chat") {
              row = (
                <span>
                  <span className="font-medium" style={{ color: "#7e0505" }}>
                    {`<${user}>`}
                  </span>
                  : {message}
                </span>
              );
            } else if (event === "quit") {
              row = (
                <span style={{ color: "#000b7d" }}>
                  *** Çıkış: {user} ({email})
                </span>
              );
            } else if (event === "nick_change") {
              row = (
                <span className="font-medium" style={{ color: "#189213" }}>
                  * {user} nickini {new_nick} olarak değiştirdi.
                </span>
              );
            }

            return (
              <div key={index} className="chat-item">
                <span className="chat-time font-medium pe-1">[{time}]</span>
                {row}
              </div>
            );
          })}
        </div>
      </div>
    );

  };

  return (
    <div className="chats" ref={chatContainerRef} onScroll={handleScroll}>
      <div className="chat-content">
        {opening.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
        <Chats />
      </div>
    </div>
  );

};

export default Console;