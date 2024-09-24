import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const API_URL = 'https://jurisai.onrender.com/';

async function sendQuery(prompt, language = 'english') {
  try {
    const response = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, language }),
      credentials: 'include' // This is needed for session management
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [language, setLanguage] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (language) {
      setMessages([
        {
          text: language === 'english'
            ? "Hello! I'm Juris AI, your legal assistant. How can I help you today?"
            : "नमस्ते! मैं जूरिस एआई हूं, आपका कानूनी सहायक। मैं आज आपकी कैसे मदद कर सकता हूं?",
          sender: 'bot'
        }
      ]);
    }
  }, [language]);

  useEffect(() => {
    gsap.from('.chat-message', {
      opacity: 0,
      y: 10,
      stagger: 0.05,
      duration: 0.3,
    });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleLanguageSelection = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendQuery(input);
      setMessages((prev) => [...prev, { text: response.answer, sender: 'bot' }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prev) => [...prev, {
        text: language === 'english'
          ? 'I apologize, but I encountered an error while processing your request. Could you please try again?'
          : 'क्षमा करें, लेकिन आपके अनुरोध को संसाधित करते समय मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।',
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };


  const formatMessage = (text) => {
    const lines = text.split('\n');
    let inList = false;
    let listType = null;

    const formatLine = (line) => {
      // Handle URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = line.split(urlRegex);

      return parts.map((part, index) => {
        if (urlRegex.test(part)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
              style={{ color: '#3b82f6' }}
            >
              {part}
            </a>
          );
        }

        // Handle bold text
        const boldRegex = /\*\*\*(.*?)\*\*/g;
        const boldParts = part.split(boldRegex);

        return boldParts.map((subPart, subIndex) =>
          subIndex % 2 === 1 ? (
            <strong key={subIndex}>{subPart}</strong>
          ) : (
            subPart
          )
        );
      });
    };

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Main heading
      if (trimmedLine.startsWith('#') && trimmedLine.endsWith('#')) {
        inList = false;
        const headingText = trimmedLine.replace(/#/g, '').trim();
        return <h1 key={index} className="text-3xl font-bold mb-2">{formatLine(headingText)}</h1>;
      }

      // Side heading
      if (trimmedLine.startsWith('===') && trimmedLine.endsWith('===')) {
        inList = false;
        const headingText = trimmedLine.replace(/===/g, '').trim();
        // Remove # symbol if present
        const cleanHeadingText = headingText.startsWith('#') ? headingText.substring(1).trim() : headingText;
        return <h2 key={index} className="text-2xl font-semibold mb-2">{formatLine(cleanHeadingText)}</h2>;
      }

      // Unordered list item
      if (trimmedLine.startsWith('•')) {
        const content = trimmedLine.substring(1).trim();
        if (!inList || listType !== 'unordered') {
          inList = true;
          listType = 'unordered';
          return (
            <ul key={index} className="list-disc pl-5 mb-2">
              <li>{formatLine(content)}</li>
            </ul>
          );
        }
        return <li key={index}>{formatLine(content)}</li>;
      }

      // Regular paragraph
      inList = false;
      listType = null;
      return <p key={index} className="mb-2">{formatLine(trimmedLine)}</p>;
    });
  };

  if (!language) {
    return (
      <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-gray-900 text-white rounded-lg overflow-hidden">
        <h1 className="text-xl font-bold p-3 bg-gray-800 text-yellow-400">Juris AI</h1>
        <div className="flex-grow flex flex-col items-center justify-center p-3 bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">Select Your Preferred Language</h2>
          <h3 className="text-md mb-4">अपनी पसंदीदा भाषा चुनें</h3>
          <div className="space-y-3 w-full max-w-xs">
            <button
              onClick={() => handleLanguageSelection('english')}
              className="w-full bg-yellow-500 text-gray-900 px-4 py-2 rounded text-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              English
            </button>
            <button
              onClick={() => handleLanguageSelection('hindi')}
              className="w-full bg-yellow-500 text-gray-900 px-4 py-2 rounded text-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-gray-900 text-white rounded-lg overflow-hidden">
      <h1 className="text-xl font-bold p-3 bg-gray-800 text-yellow-400">Juris AI</h1>
      <div ref={chatRef} className="flex-grow overflow-y-auto p-3 bg-gray-800">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message flex mb-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`p-2 rounded-lg max-w-[80%] ${message.sender === 'user' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-white'} break-words`}>
              {message.sender === 'user' ? message.text : formatMessage(message.text)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message flex justify-start mb-2">
            <div className="p-2 bg-gray-700 text-white rounded-lg max-w-[80%]">
              {language === 'english' ? 'Analyzing...' : 'विश्लेषण कर रहा हूं...'}
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex p-2 bg-gray-800">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="flex-grow p-2 text-sm rounded-l-md bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
          placeholder={language === 'english' ? "Ask a legal question..." : "एक कानूनी प्रश्न पूछें..."}
        />
        <button
          type="submit"
          className="bg-yellow-500 text-gray-900 p-2 rounded-r-md text-sm hover:bg-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-400"
        >
          {language === 'english' ? 'Send' : 'भेजें'}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;