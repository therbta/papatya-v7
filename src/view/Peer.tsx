import React from 'react'

type Props = {
  connected: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  userScrolledUp: React.RefObject<boolean>;
  currentUser?: string;
  peerUser?: string;
  peerChatData: Array<any>;
}

const Peer = (props: Props) => {
  const { connected, chatContainerRef, userScrolledUp, currentUser, peerUser, peerChatData } = props;

  // Use peer-specific chat data
  const allMessages = React.useMemo(() => {
    return peerChatData;
  }, [peerChatData]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <div style={{ marginTop: "auto" }}>
        {allMessages.map((chat, index) => {
          const { time, event, message, user } = chat;
          const isCurrentUser = currentUser && user === currentUser;

          let row: JSX.Element | null = null;

          if (event === "chat") {
            row = (
              <span>
                <span
                  style={{
                    color: isCurrentUser ? "#0066cc" : "#7e0505",
                    fontWeight: "normal"
                  }}
                >
                  {`<${user}>`}
                </span>
                : {message}
              </span>
            );
          }

          return (
            <div
              key={`${index}-${user}-${time}`}
              className="chat-item"
            >
              <span className="chat-time pe-1">[{time}]</span>
              {row}
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default React.memo(Peer);