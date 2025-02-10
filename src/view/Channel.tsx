import React, { JSX } from 'react'

// Consts
import { chats } from '../const';

type Props = {
  connected: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  userScrolledUp: React.RefObject<boolean>;
}

const Channel = (props: Props) => {

  // Props:
  const { connected, chatContainerRef, userScrolledUp } = props;

  // States
  const [displayedChats, setDisplayedChats] = React.useState<typeof chats>([]);

  // Effects
  React.useEffect(() => {

    let delay = 100;
    let isMounted = true;

    if (connected) {
      chats.forEach((chat: any) => {
        setTimeout(() => {
          if (isMounted) {
            setDisplayedChats((prevChats) =>
              prevChats.some(c => c.time === chat.time && c.user === chat.user)
                ? prevChats
                : [...prevChats, { ...chat, time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) }]
            )
            if (chatContainerRef.current && !userScrolledUp.current) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
          }
        }, delay);
        delay += Math.random() * 1000 + 300;
      });
    }

    return () => {
      isMounted = false;
    };
  }, [connected]);


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
            )

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
  )
}

export default React.memo(Channel)