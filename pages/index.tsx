import React, { useState, useEffect } from 'react';
import { BiSolidUser } from 'react-icons/bi';
import { CiUser } from 'react-icons/ci';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('message', (msg) => {
      setChat((prevChat) => [
        ...prevChat,
        { content: msg, sentByUser: false, timestamp: new Date() },
      ]);
      console.log('Message received from server: ', msg);
    });

    // Clean up the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim() !== '') {
      setChat((prevChat) => [
        ...prevChat,
        { content: message, sentByUser: true, timestamp: new Date() },
      ]);
      socket.emit('message', message);
      console.log('Message sent to server: ', message);
      setMessage('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="border rounded-lg shadow-md p-4 mb-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Live Chat App</h1>
        </div>
        <div className="mb-4">
          {chat.map((msg, index) => (
            <div key={index} className="flex items-center">
              {msg.sentByUser ? (
                <BiSolidUser size={16} className="mr-2" />
              ) : (
                <CiUser size={16} className="mr-2" />
              )}
              <div className="flex-grow">
                <div
                  className={`border-b pb-2 ${
                    msg.sentByUser ? 'text-blue-500' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-baseline">
                    <span className="align-baseline">{msg.content}</span>
                    <div className="text-right text-xs text-gray-500 ml-auto">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <input
              type="text"
              className="w-full border rounded-l-md p-2"
              placeholder="Enter your message..."
              value={message}
              onChange={handleMessageChange}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold rounded-r-md px-4 py-2 ml-2"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatApp;
