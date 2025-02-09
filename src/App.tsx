import { useState } from 'react';

// UI
import { Splitter } from 'antd';

// Consts
import { nicknames, op_colors, DEFAULT_CHANNELS } from './const';

// Assets
import Background from './assets/arka.jpg';

import SideBg from './assets/yan.jpg';
import ChannelItemIcon from './assets/channel_icon.png';
import ListItemIcon from './assets/list_icon.png';

// Components
import MenuBar from './components/MenuBar';
import Toolbar from './components/Toolbar';
import Console from './view/Console';

// Audio
import Intro from './assets/sound/yavuzcetin.wav';

const myNick = 'bLueStar';
const script_name = 'PAPATYA';
const script_version = 'v7';

// ==============================================================================================


const App = () => {

  // States
  const [selected, setSelected] = useState<number | null>(null);
  const [channels, setChannels] = useState<string[]>(DEFAULT_CHANNELS);
  const [chatUsers, setChatUsers] = useState<string[]>([]);

  return (
    <div>

      <audio id="audio" src={Intro} />

      <MenuBar />
      <Toolbar />

      <div className="main">

        <Splitter>

          <Splitter.Panel className="chat-window">
            <div className="chat-container">
              <div className="chats">
                <Console />
              </div>
            </div>
          </Splitter.Panel>


          <Splitter.Panel min={150} max={400} defaultSize={215} className="list">

            {nicknames.map((item, index) => {

              const { nick, op } = item;
              const color = op_colors.find((opItem) => opItem.sign === op)?.color;

              return (
                <div
                  key={index}
                  style={{ color }}
                  className={`nick-item ${selected === index ? 'selected' : ''}`}
                  onClick={() => setSelected(index)}
                  onDoubleClick={() => {

                    if (chatUsers.includes(nick)) {
                    } else {
                      setChatUsers([...chatUsers, nick]);
                    }

                  }}
                >
                  {op}{nick}
                </div>
              )
            })
            }

          </Splitter.Panel>
        </Splitter>


        <div className="channels" style={{ backgroundImage: `url(${SideBg})` }}>

          {channels.map((channel, index) => (
            <div key={index} className="channel-item">
              <img src={ChannelItemIcon} className='channel-icon' />
              <span className="channel-text">
                {channel}
              </span>
            </div>
          ))}

          {chatUsers.map((user, index) => (
            <div key={index} className="channel-item">
              <img src={ListItemIcon} className='channel-icon' />
              <span className="channel-text">
                {user}
              </span>
            </div>
          ))}

        </div>


      </div> {/* Main */}


      <div className="chat-input">
        <input type="text" id="chat-input" autoComplete='off' autoCorrect='off' autoCapitalize='off' />
      </div>


    </div>
  );
};

export default App;