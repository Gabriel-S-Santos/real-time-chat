import React, { useState, useEffect, FormEvent } from 'react';
import { io } from 'socket.io-client';


const socket = io('http://localhost:4000');

socket.on('connect', () => {
  console.log('Connected to server'); // Adicione esta linha
});


interface Message {
  id: string;
  text: string;
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on('message', (message: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: new Date().toISOString(), text: message },
      ]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 h-screen">
      <div className="w-full max-w-md">
        <div className="bg-white p-4 rounded shadow">
          {messages.map((msg) => (
            <div key={msg.id} className="p-2 border-b border-gray-200">
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="mt-4 flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-l"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
