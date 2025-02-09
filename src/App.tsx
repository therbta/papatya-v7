import React, { useState, JSX } from 'react';

// UI
import { Splitter } from 'antd';

// Consts
import { bar, nicknames, op_colors, formatDate, channels, chats } from './const';

// Assets
import BarIcon from './assets/bar.png';

import Icon1 from './assets/imgs/1.png';
import Icon2 from './assets/imgs/2.png';
import Icon3 from './assets/imgs/3.png';
import Icon4 from './assets/imgs/4.png';
import Icon5 from './assets/imgs/5.png';
import Icon6 from './assets/imgs/6.png';
import Icon7 from './assets/imgs/7.png';
import Icon8 from './assets/imgs/8.png';
import Icon9 from './assets/imgs/9.png';
import Icon10 from './assets/imgs/10.png';
import Icon11 from './assets/imgs/11.png';
import Icon12 from './assets/imgs/12.png';
import Icon13 from './assets/imgs/13.png';
import Icon14 from './assets/imgs/14.png';
import Icon15 from './assets/imgs/15.png';
import Icon16 from './assets/imgs/16.png';
import Icon17 from './assets/imgs/17.png';
import Icon18 from './assets/imgs/18.png';

import Background from './assets/arka.jpg';
import NavBg from './assets/nav.png';
import SideBg from './assets/yan.jpg';

import ChannelItemIcon from './assets/channel_icon.png';
import ListItemIcon from './assets/list_icon.png';

// Audio
import Intro from './assets/sound/yavuzcetin.wav';

const myNick = 'bLueStar';
const script_name = 'PAPATYA';
const script_version = 'v7';

// ==============================================================================================


const App = () => {

  // 

  // States
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const handleMenuClick = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  React.useEffect(() => {

    const chatContainer = document.querySelector('.chats');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

  }, []);



  // Opening:
  const badge = <div className='flex items-center'>
    <div style={{ width: 5, backgroundColor: '#d2d2d2' }}>&nbsp;</div>
    <div style={{ backgroundColor: '#fc1313', color: '#fff' }} className='px-1'>{script_name}</div>
    <div style={{ backgroundColor: '#000b7e', color: '#fff' }} className='px-1'>{script_version}</div>
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
    <div className='flex items-center'> {dashes} Şu anki nickiniz: <span className="primary ps-1">{myNick}</span> </div>,
    <div className='flex items-center mb-1.5'> {dashes} Kısayol (F) tuşlarını öğrenmek için <span className="primary px-1">F12</span> tuşuna basınız. </div>,
  ];

  const Chats = () => {

    return chats.map((chat, index) => {

      const { time, event, message, user, new_nick, email, channel } = chat;

      let row: JSX.Element | null = null;
      let color = '';

      if (event === 'login') {
        row = (
          <span style={{ color: '#129393' }}>
            *** Giriş: {user} ({email}) {channel}
          </span>
        );

      } else if (event === 'chat') {
        row = (
          <span>
            <span className='font-medium' style={{ color: '#7e0505' }}>{`<${user}>`}</span>: {message}
          </span>
        );
      } else if (event === 'quit') {
        row = (
          <span style={{ color: '#000b7d' }}>
            *** Çıkış: {user} ({email})
          </span>
        );
      } else if (event === 'nick_change') {
        row = (
          <span className='font-medium' style={{ color: '#189213' }}>
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
    })

  }




  return (
    <div>

      <audio id="audio" src={Intro} />

      <div className="bar">

        <img src={BarIcon} className='bar-icon' alt='bar-icon' />

        {bar.map((item) => (
          <div key={item.menu} className='menu-item'>

            <button onClick={() => handleMenuClick(item.menu)}>{item.menu}</button>

            {openMenu === item.menu && (
              <div className='sub-menu'>
                {item.submenu.map((subItem, index) => (
                  <div key={index} className='sub-menu-item'>
                    {subItem}
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>

      <div
        className="toolbar"
        style={{
          backgroundImage: `url(${NavBg})`,
          backgroundSize: 'auto 100%',
        }}
      >

        <div className="toolbar-icons">
          {/* Bar icons */}
          {[Icon1, Icon2, Icon3, Icon4, Icon5, Icon6, Icon7, Icon8, Icon9, Icon10, Icon11, Icon12, Icon13, Icon14, Icon15, Icon16, Icon17, Icon18].map((icon, index) => (
            <span className="toolbar-item">
              <img
                key={index}
                src={icon}
                alt={`Icon ${index + 1}`}
              />
            </span>
          ))}
        </div>

      </div>


      <div className="main">

        <Splitter>

          <Splitter.Panel className="chat-window">
            <div className="chat-container">
              <div className="chats">

                {opening.map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
                <Chats />

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
                  className={`nick-item ${selected === index ? 'selected' : ''}`} onClick={() => setSelected(index)}>
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
        </div>


      </div> {/* Main */}


      <div className="chat-input">
        <input type="text" id="chat-input" autoComplete='off' autoCorrect='off' autoCapitalize='off' />
      </div>


    </div>
  );
};

export default App;