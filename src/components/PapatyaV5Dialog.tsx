import React, { useState } from 'react';
import { PAPATYA_DATA } from '../constants/papatyaData';

interface PapatyaV5DialogProps {
  onConnect: (nickname: string, server: any) => void;
  onClose: () => void;
}

const PapatyaV5Dialog: React.FC<PapatyaV5DialogProps> = ({ onConnect, onClose }) => {
  const [activeTab, setActiveTab] = useState('baglanti');
  const [nickname, setNickname] = useState('PAPATYAv7-' + (Math.random() * 1000).toFixed(0));
  const [selectedServer, setSelectedServer] = useState('SiberTR.Net');

  const handleConnect = () => {
    const server = PAPATYA_DATA.servers.find(s => s.name === selectedServer);
    if (server && nickname.trim()) {
      onConnect(nickname.trim(), server);
    }
  };

  return (
    <div className="papatya-dialog-wrapper">
      <div className="papatya-dialog">
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

        {/* Banner */}
        <div className="dialog-banner">
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