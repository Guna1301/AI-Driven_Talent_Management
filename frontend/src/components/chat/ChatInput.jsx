import React, { useState } from 'react';
import { Mic, Send, Upload } from 'lucide-react';

const ChatInput = ({ onSend, onUpload }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() === '') return;
    onSend(message);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-b from-gray-400 to-gray-200">
      
      <button
        onClick={onUpload}
        className="flex items-center px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base whitespace-nowrap"
      >
        <Upload size={16} className="mr-1" />
        Upload
      </button>
      
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask"
        className="flex-1 min-w-[150px] bg-transparent outline-none text-black placeholder-gray-500 text-sm sm:text-base"
      />
      
      <button
        onClick={handleSend}
        className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
      >
        <Mic size={20} />
      </button>
      
      <button
        onClick={handleSend}
        className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default ChatInput;
