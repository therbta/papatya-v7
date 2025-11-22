import React from 'react';
import Window from './Window';

interface WhoisInfo {
  nick: string;
  ip: string;
  isim: string;
  rumuzBilgi: string;
  kanallar: string[];
  server: string;
}

interface WhoisDialogProps {
  user: string;
  whoisInfo: WhoisInfo;
  isVisible: boolean;
  onClose: () => void;
}

const WhoisDialog: React.FC<WhoisDialogProps> = ({ user, whoisInfo, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000]" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <Window
          title={`Whois: ${user}`}
          width={400}
          height={300}
          setIsModalVisible={onClose}
        >
          <div style={{ 
            fontFamily: '"Fixedsys", "Terminal", "Px437 IBM VGA 8x16", monospace',
            fontSize: '13px',
            lineHeight: '1.6',
            padding: '10px',
            color: '#000',
            whiteSpace: 'pre-line'
          }}>
            <div style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#000' }}>~</span>{' '}
              <span style={{ color: '#000' }}>Nick:</span>{' '}
              <span style={{ color: '#ff0000', fontWeight: 'bold' }}>{whoisInfo.nick}</span>
            </div>
            
            <div style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#000' }}>~</span>{' '}
              <span style={{ color: '#000' }}>IP:</span>{' '}
              <span style={{ color: '#000' }}>{whoisInfo.ip}</span>
            </div>
            
            <div style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#000' }}>~</span>{' '}
              <span style={{ color: '#000' }}>İsim:</span>{' '}
              <span style={{ color: '#000' }}>{whoisInfo.isim}</span>
            </div>
            
            <div style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#000' }}>~</span>{' '}
              <span style={{ color: '#000' }}>Rumuz Bilgi:</span>{' '}
              <span style={{ color: '#000' }}>{whoisInfo.rumuzBilgi}</span>
            </div>
            
            <div style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#000' }}>~</span>{' '}
              <span style={{ color: '#000' }}>Kanallar:</span>{' '}
              <span style={{ color: '#000' }}>
                {whoisInfo.kanallar.length > 0 
                  ? whoisInfo.kanallar.join(' ') 
                  : 'Yok'}
              </span>
            </div>
            
            <div style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#000' }}>~</span>{' '}
              <span style={{ color: '#000' }}>Server:</span>{' '}
              <span style={{ color: '#0000ff', fontWeight: 'bold' }}>{whoisInfo.server}</span>
            </div>
          </div>
        </Window>
      </div>
    </div>
  );
};

export default WhoisDialog;
