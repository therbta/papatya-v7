import React, { useState, useRef, useEffect } from 'react';
import { PAPATYA_DATA } from '../constants/papatyaData';

interface PapatyaV5DialogProps {
  onConnect: (nickname: string, server: any) => void;
  onClose: () => void;
}

const PapatyaV5Dialog: React.FC<PapatyaV5DialogProps> = ({ onConnect, onClose }) => {
  const [activeTab, setActiveTab] = useState('baglanti');
  
  // Load saved nickname from localStorage, or use default
  const getSavedNickname = (): string => {
    const saved = localStorage.getItem('papatya_last_nickname');
    if (saved) {
      return saved;
    }
    return 'PAPATYAv7-' + (Math.random() * 1000).toFixed(0);
  };
  
  const [nickname, setNickname] = useState(getSavedNickname);
  const [selectedServer, setSelectedServer] = useState('SiberTR.Net');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleConnect = () => {
    const server = PAPATYA_DATA.servers.find(s => s.name === selectedServer);
    if (server && nickname.trim()) {
      const trimmedNickname = nickname.trim();
      // Save nickname to localStorage when connecting
      localStorage.setItem('papatya_last_nickname', trimmedNickname);
      onConnect(trimmedNickname, server);
    }
  };

  // Center dialog on mount
  useEffect(() => {
    if (dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth / 2 - rect.width / 2,
        y: window.innerHeight / 2 - rect.height / 2
      });
    }
  }, []);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't drag if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('button') || target.closest('input')) {
      return;
    }
    
    if (dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      e.preventDefault();
    }
  };

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep dialog within viewport bounds
        const dialogWidth = dialogRef.current?.offsetWidth || 400;
        const dialogHeight = dialogRef.current?.offsetHeight || 300;
        const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - dialogWidth));
        const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - dialogHeight));
        
        setPosition({ x: constrainedX, y: constrainedY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div className="papatya-dialog-wrapper">
      <div 
        ref={dialogRef}
        className="papatya-dialog"
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
      >
        {/* Tabs */}
        <div className="dialog-tabs">
          <button
            className={`tab ${activeTab === 'korumalar' ? 'active' : ''}`}
            onClick={() => setActiveTab('korumalar')}
          >
            Korumalar
          </button>
          <button
            className={`tab ${activeTab === 'ayarlar' ? 'active' : ''}`}
            onClick={() => setActiveTab('ayarlar')}
          >
            Ayarlar
          </button>
          <button
            className={`tab ${activeTab === 'hakkinda' ? 'active' : ''}`}
            onClick={() => setActiveTab('hakkinda')}
          >
            Hakkında
          </button>
        </div>

        {/* Banner - Draggable area */}
        <div 
          className="dialog-banner"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'grab' }}
        >
          <div className="banner-icon">🌼</div>
          <div className="banner-text">
            <div className="banner-title" style={{ letterSpacing: '-0.02rem' }}>PAPATYA e-mIRC</div>
            <div className="banner-url">http://www.sibertr.online</div>
          </div>
        </div>

        {/* Connection Section */}
        <div className="connection-box">
          <div className="connection-title">Bağlantı</div>

          <div className="connection-content">
            <div className="connection-icon">🏠</div>

            <div className="connection-form">
              <label className="form-label" style={{ fontSize: '12px' }}>Takma İsim:</label>
              <input
                type="text"
                className="form-input"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={{ maxWidth: '130px' }}
              />
              <button
                className="connect-btn"
                onClick={handleConnect}
              >
                BAĞLAN!
              </button>
            </div>
          </div>

          {/* Server Buttons */}
          {/* <div className="server-grid">
            {PAPATYA_DATA.servers.map((server) => (
              <button
                key={server.id}
                className={`server-btn ${selectedServer === server.name ? 'selected' : ''}`}
                onClick={() => setSelectedServer(server.name)}
              >
                {server.name}
              </button>
            ))}
          </div> */}
        </div>

        {/* Footer Button */}
        <div className="dialog-footer">
          <button className="footer-btn" onClick={onClose}>
            Tamam / Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PapatyaV5Dialog;