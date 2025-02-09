import React from 'react'


// Assets
import NavBg from '../assets/nav.png';

// Icons
import Icon1 from '../assets/imgs/1.png';
import Icon2 from '../assets/imgs/2.png';
import Icon3 from '../assets/imgs/3.png';
import Icon4 from '../assets/imgs/4.png';
import Icon5 from '../assets/imgs/5.png';
import Icon6 from '../assets/imgs/6.png';
import Icon7 from '../assets/imgs/7.png';
import Icon8 from '../assets/imgs/8.png';
import Icon9 from '../assets/imgs/9.png';
import Icon10 from '../assets/imgs/10.png';
import Icon11 from '../assets/imgs/11.png';
import Icon12 from '../assets/imgs/12.png';
import Icon13 from '../assets/imgs/13.png';
import Icon14 from '../assets/imgs/14.png';
import Icon15 from '../assets/imgs/15.png';
import Icon16 from '../assets/imgs/16.png';
import Icon17 from '../assets/imgs/17.png';
import Icon18 from '../assets/imgs/18.png';


const Toolbar = () => {
  return (
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
  )
}

export default Toolbar