import React from 'react'

// Consts
import { bar } from '../const';

// Assets:
import BarIcon from '../assets/bar.png';


interface MenuItem {
  menu: string;
  submenu: string[];
}

const MenuBar = () => {

  // States
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  const handleMenuClick = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  React.useEffect(() => {

    const chatContainer = document.querySelector('.chats');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

  }, []);

  return (
    <div className="bar">

      <img src={BarIcon} className='bar-icon' alt='bar-icon' />

      {bar.map((item: MenuItem) => (
        <div key={item.menu} className='menu-item'>

          <button onClick={() => handleMenuClick(item.menu)}>{item.menu}</button>

          {openMenu === item.menu && (
            <div className='sub-menu'>
              {item.submenu.map((subItem: string, index: number) => (
                <div key={index} className='sub-menu-item'>
                  {subItem}
                </div>
              ))}
            </div>
          )}

        </div>
      ))}
    </div>
  )
}

export default MenuBar