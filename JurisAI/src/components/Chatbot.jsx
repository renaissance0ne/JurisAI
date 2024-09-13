import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';

const Chatbot = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef(null);

    useEffect(() => {
        // Add the introduction message when the component mounts
        setMessages([
            { 
                text: "Hello! I'm Juris AI, your legal assistant. How can I help you today?", 
                sender: 'bot' 
            }
        ]);
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/query', { prompt: input });
            setMessages((prev) => [...prev, { text: response.data.answer, sender: 'bot' }]);
        } catch (error) {
            console.error('Error fetching response:', error);
            setMessages((prev) => [...prev, { text: 'I apologize, but I encountered an error while processing your request. Could you please try again?', sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-gray-900 text-white rounded-lg overflow-hidden">
            <h1 className="text-xl font-bold p-3 bg-gray-800 text-yellow-400">Juris AI</h1>
            <div ref={chatRef} className="flex-grow overflow-y-auto p-3 bg-gray-800">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`chat-message flex mb-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`p-2 rounded-lg max-w-[80%] ${message.sender === 'user' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-white'}`}>
                            {message.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message flex justify-start mb-2">
                        <div className="p-2 bg-gray-700 text-white rounded-lg max-w-[80%]">
                            Analyzing...
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
                    placeholder="Ask a legal question..."
                />
                <button
                    type="submit"
                    className="bg-yellow-500 text-gray-900 p-2 rounded-r-md text-sm hover:bg-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chatbot;