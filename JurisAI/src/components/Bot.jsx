import React, { useState, useEffect } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import VideoCarousel from "./VideoCarousel";
import Chatbot from "./Chatbot";

const Bot = () => {
    const [showChatbot, setShowChatbot] = useState(false);

    useGSAP(() => {
        gsap.to('#title', { opacity: 1, y: 0 });
        gsap.to('.link', { opacity: 1, y: 0, duration: 1, stagger: 1 });
    }, []);

    useEffect(() => {
        if (showChatbot) {
            gsap.from('.chatbot-modal', {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }, [showChatbot]);

    const toggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };

    return (
        <section id="tryourbot!" className='w-screen overflow-hidden h-full common-padding bg-zinc'>
            <div className='screen-max-width'>
                <div className="mb-12 w-full items-end md:flex justify-between">
                    <h1 id="title" className="section-heading">Try Our Bot!</h1>
                    <button
                        className="link px-8 py-3 text-lg uppercase tracking-wider rounded-full hover:bg-yellow-400 transition duration-300 ease-in-out"
                        style={{ backgroundColor: '#f6e700', color: 'black' }}
                        onClick={toggleChatbot}
                    >
                        Juris AI
                    </button>
                </div>
                {showChatbot && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                        <div className="chatbot-modal bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                            <Chatbot />
                            <button
                                className="w-full py-2 bg-yellow-500 text-gray-900 text-sm hover:bg-yellow-600 transition duration-300 ease-in-out"
                                onClick={toggleChatbot}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
                {!showChatbot && (
                    <div>
                        <VideoCarousel />
                    </div>
                )}
            </div>
        </section>
    )
}

export default Bot;