import { useState, useRef, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import ChatInput from '../components/chat/ChatInput';
import ProjectUploadModal from '../components/chat/ProjectUpload';

const ChatPage = () => {
  const messagesEndRef = useRef(null);

  const defaultMessages = [
    { text: "Hello! I'm your Resource Management Assistant.", sender: 'ai' },
    { text: 'You can ask me about team allocation, project status, or resources.', sender: 'ai' },
  ];

  const [messages, setMessages] = useState(defaultMessages);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleSendMessage = async (msg) => {
    const userMessage = { text: msg, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axiosInstance.post('/chat-message', { message: msg });

      const aiMessage = {
        text: res.data.message || 'No response from server',
        sender: 'ai',
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const aiMessage = {
        text: "Oops! Something went wrong.",
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  const handleUpload = () => {
    setIsUploadOpen(true);
  };

  const closeUpload = () => {
    setIsUploadOpen(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-neutral-900 scroll-smooth">
      <div className="bg-neutral-900 p-4">
        <h1 className="text-2xl font-bold text-white">Alloc AI</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbarHide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-4 rounded-lg max-w-xs break-words ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-neutral-700 text-white rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSendMessage} onUpload={handleUpload} />

      <ProjectUploadModal isOpen={isUploadOpen} onClose={closeUpload} />
    </div>
  );
};

export default ChatPage;
