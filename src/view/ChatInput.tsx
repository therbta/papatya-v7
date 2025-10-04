import React from 'react'

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  currentChannel?: string;
  currentUser?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, currentChannel, currentUser }) => {
  const [message, setMessage] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  React.useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <input
        ref={inputRef}
        type="text"
        id="chat-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        placeholder={currentChannel ? `${currentChannel}> ` : 'Type your message...'}
      />
    </form>
  )
}

export default React.memo(ChatInput)