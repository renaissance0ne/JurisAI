import { useGSAP } from '@gsap/react'
import React from 'react'
import { animateWithGsap } from '../utils/animations';

const AboutUs = () => {
    useGSAP(() => {
        animateWithGsap('#aboutUs_title', { y: 0, opacity: 1 })
        animateWithGsap('.g_text', { y: 0, opacity: 1, ease: 'power2.inOut', duration: 1 })
    }, []);
    return (
        <section id='aboutus' className='h-full common-padding bg-zinc relative overflow-hidden'>
            <div className='screen-max-width'>
                <div className='mb-12 w-full'>
                    <h1 id="aboutUs_title" className='section-heading'>
                        Explore the full story.
                    </h1>
                </div>

                <div className='flex flex-col justify-center items-center overflow-hidden'>
                    <div className='mt-16 mb-16 pl-24'>
                        <h2 className='text-xl lg:text-3xl font-semibold'>JurisAI</h2>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className='flex-center'>
                        <p className='feature-text g_text text-gray-500 font-semibold' style={{ textAlign: 'justify' }}>
                            Our Department of Justice virtual assistant leverages {' '}
                            <span className='text-white'>
                                advanced Retrieval-Augmented Generation (RAG) technology
                            </span>,
                            to provide precise and contextually relevant responses.
                        </p>
                    </div>
                    <div className='flex-center'>
                        <p className='feature-text g_text text-gray-500 font-semibold' style={{ textAlign: 'justify' }}>
                            By integrating a {' '}
                            <span className='text-white'>
                                powerful vector database with FAISS and employing sophisticated document retrieval techniques,
                            </span>
                            {' '}we ensure that the chatbot delivers accurate information based on extensive legal queries.
                        </p>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
                    <div className='flex-center'>
                        <p className='mt-16 feature-text g_text text-gray-500 font-semibold' style={{ textAlign: 'justify' }}>
                            At the core of our system is {' '}
                            <span className='text-white'>
                                the Llama-3.1 model, accessed via ChatGroq.
                            </span>
                            This model is {' '}
                            <span className='text-white'>
                                fine-tuned to handle complex queries and provide insightful responses.
                            </span>
                        </p>
                    </div>
                    <div className='flex-center'>
                        <p className='mt-16 feature-text g_text text-gray-500 font-semibold' style={{ textAlign: 'justify' }}>
                            We utilize {' '}
                            <span className='text-white'>
                                LangChain components such as HuggingFace embeddings
                            </span>
                            {' '} and recursive text splitting to convert and manage data efficiently, ensuring that our chatbot remains responsive and reliable.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutUs
