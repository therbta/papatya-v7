import React from 'react';

// UI
import { Splitter } from 'antd';

// Consts
import { DEFAULT_CHANNELS, config } from './const';

// Assets
import Background from './assets/arka.jpg';

import SideBg from './assets/yan.jpg';
import BarIcon from './assets/bar.png';
import ChannelItemIcon from './assets/channel_icon.png';
import ListItemIcon from './assets/list_icon.png';

// Components
import MenuBar from './components/MenuBar';
import Toolbar from './components/Toolbar';
import Console from './view/Console';

// Audio
import Intro from './assets/sound/yavuzcetin.wav';
import ConnectedWAV from './assets/sound/papatyaconnect.wav';
import JoinedWAV from './assets/sound/papatyajoin.wav';


// Lazy-loaded components
const List = React.lazy(() => import('./view/List'));
const ChatInput = React.lazy(() => import('./view/ChatInput'));

// ==============================================================================================


const App = () => {

  // States
  const [connected, setConnected] = React.useState(false);
  const [activeWindow, setActiveWindow] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [channels, setChannels] = React.useState<string[]>(DEFAULT_CHANNELS);
  const [chatUsers, setChatUsers] = React.useState<string[]>([]);


  React.useEffect(() => {

    setTimeout(() => {

      setConnected(true);
      setActiveWindow(`#${DEFAULT_CHANNELS[0]}`);

      // Play connected sound
      const audio = new Audio(ConnectedWAV);
      audio.play();

    }, 3000);

  }, []);

  return (
    <div>

      <audio id="audio" src={Intro} autoPlay loop={false} />

      <MenuBar />
      <Toolbar
        connected={connected}
        setConnected={setConnected}
      />

      <div className="main">

        <Splitter>

          <Splitter.Panel className="chat-window" style={{ width: `calc(100% - 400px)` }}>
            <div className="chat-container">
              <div className="chats">
                <Console
                  activeWindow={activeWindow}
                  connected={connected}
                />
              </div>
            </div>
          </Splitter.Panel>


          {/* List */}
          <Splitter.Panel
            min={150}
            max={400}
            defaultSize={215}
            className="list"
            style={{ backgroundColor: (!connected || !activeWindow) ? '#f5f5f5' : '#ccc' }}
          >
            <React.Suspense fallback={null}>
              <List
                hideComponent={!connected || !activeWindow}
                selected={selected}
                setSelected={setSelected}
                chatUsers={chatUsers}
                setChatUsers={setChatUsers}
              />
            </React.Suspense>
          </Splitter.Panel>



          {/* Channels */}
          <Splitter.Panel
            min={100}
            max={200}
            defaultSize={100}
            className="channels"
            style={{
              backgroundImage: `url(${SideBg})`,
              backgroundSize: 'cover',
            }}
          >

            {/* Console */}
            <div
              className={`channel-item ${!activeWindow ? 'active' : ''}`}
              onClick={() => setActiveWindow(null)}
            >
              <img src={BarIcon} className='channel-icon' />
              <span className="channel-text">
                {config.server_name}
              </span>
            </div>

            {/* Channels */}
            {connected && channels.map((channel, index) => {

              return (
                <div
                  key={index}
                  className={`channel-item ${activeWindow === `#${channel}` ? 'active' : ''}`}
                  onClick={() => setActiveWindow(`#${channel}`)}
                >
                  <img src={ChannelItemIcon} className='channel-icon' />
                  <span className="channel-text">
                    {channel}
                  </span>
                </div>
              )
            })}

            {/* Users */}
            {chatUsers.map((user, index) => (
              <div key={index} className="channel-item">
                <img src={ListItemIcon} className='channel-icon' />
                <span className="channel-text">
                  {user}
                </span>
              </div>
            ))}



          </Splitter.Panel>
        </Splitter>


      </div> {/* Main */}


      <React.Suspense fallback={null}>
        <ChatInput />
      </React.Suspense>

    </div>
  );
};

export default App;