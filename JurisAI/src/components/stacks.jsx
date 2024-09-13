import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger'; // Import ScrollTrigger
import { GSAPImg, langchainImg, LlamaImg, tailwindImg, threejsImg, huggingfaceImg, reactiImg, AxisoImg } from '../utils';
import { animateWithGsap } from '../utils/animations'; // Adjust the path to where your index.js is located
import axios from 'axios';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const localImages = [LlamaImg, huggingfaceImg, langchainImg, reactiImg, AxisoImg, tailwindImg, threejsImg, GSAPImg]; // Add more images as needed

const ImageCard = ({ src }) => (
    <div className="bg-gray-200 rounded-lg overflow-hidden">
        <img src={src} alt="chip" className="w-full h-32 object-cover" /> {/* Adjust the height as needed */}
    </div>
);

const Stacks = () => {
    useGSAP(() => {
        animateWithGsap('#stack_title', { y: 0, opacity: 1 })
        gsap.from('#chip', {
            scrollTrigger: {
                trigger: '#chip',
                start: '20% bottom'
            },
            opacity: 0,
            scale: 2,
            duration: 2,
            ease: 'power2.inOut'
        });
    }, []);

    return (
        <section id='techstacks' className='common-padding'>
            <div className='screen-max-width container mx-auto'>
                <div className='mb-12 w-full'>
                    <h1 id="stack_title" className='section-heading'>
                        Tech Stacks
                    </h1>
                </div>
                <div id="chip" className='grid grid-cols-4 gap-4'> {/* Change to 4 columns */}
                    {localImages.map((img, index) => (
                        <ImageCard key={index} src={img} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stacks;
