import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const teamMembers = [
    {
        name: "Vallabh Dasari",
        role: "Team Lead & Model Trainer",
        imgSrc: "/assets/images/vallabh.png",
        description: "I am a passionate AI enthusiast with experience in integrating large language models (LLMs) into web platforms. In addition to handling the backend aspects, I contributed to the front-end development of our website. Throughout this project, I have guided my teammates, ensuring the smooth execution of our vision. My focus is on leveraging AI to create innovative and user-friendly solutions.",
        linkedin: "https://www.linkedin.com/in/vallabh-dasari-22b5b92a6/",
        instagram: "https://www.instagram.com/renaissance_0ne/",
        github: "https://github.com/renaissance0ne/"
    },
    {
        name: "Dhruv Panakanti",
        role: "Researcher & Data Curator",
        imgSrc: "/assets/images/dhruv.png",
        description: "In this project, I conducted extensive research on various problem statements and suggested the integration of a (LLM) into our website. I developed a strategic approach for incorporating the LLM, focusing on how it could enhance our project. Additionally, I was responsible for creating and curating the dataset used for training the LLM, ensuring it was well-suited to meet our project's needs.",
        linkedin: "#",
        instagram: "#",
        github: "#"
    },
    {
        name: "Pudhari Swaroopa",
        role: "Front-End Developer",
        imgSrc: "/assets/images/swap.png",
        description: "I played a major role in developing the front-end of our website, focusing on creating engaging animations and styling to enhance user experience. My work involved crafting interactive elements and ensuring that the visual aspects of our site were both functional and aesthetically pleasing. My goal was to bring our design vision to life through dynamic and responsive front-end solutions.",
        linkedin: "https://www.linkedin.com/in/swaroopa-pudhari-92572731a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        instagram: "https://www.instagram.com/pudhari_swaroopa/profilecard/?igsh=cjBndDZ6djVtc3pt",
        github: "https://github.com/PudhariSwaroopa"
    },
    {
        name: "Pranitha",
        role: "Contributor",
        imgSrc: "/assets/images/prani.png",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
        linkedin: "http://linkedin.com/in/challa-pranitha-sri-bb379031a",
        instagram: "https://www.instagram.com/pranithaa_4?igsh=YWp3amM1aDMyaWVt",
        github: "https://github.com/prani23r01a66l1"
    },
    {
        name: "Adithya",
        role: "Technical Writer & Presentation Designer",
        imgSrc: "/assets/images/adi.png",
        description: "I provided essential information for our website, ensuring that the content was accurate and aligned with our project goals. Additionally, I designed and created the PowerPoint presentation that highlights our project's key aspects and achievements.",
        linkedin: "#",
        instagram: "#",
        github: "#"
    },
    {
        name: "Shritha",
        role: "Contributor",
        imgSrc: "/assets/images/shri.png",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
        linkedin: "https://www.linkedin.com/in/shritha-tirunagari-aa47b8291?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app ",
        instagram: "https://www.instagram.com/",
        github: "https://github.com/"
    },
];

const Team = () => {
    useEffect(() => {
        gsap.fromTo('.team-item',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.3, duration: 1 }
        );
    }, []);

    return (
        <section id='ourteam' className='bg-black text-white py-12'>
            <div className='container mx-auto px-4'>
                <div className='text-center mb-12'>
                    <h2 className='text-3xl font-bold mb-4'>
                        The team behind JurisAI
                    </h2>
                </div>

                <div className='flex flex-wrap justify-center -mx-4'>
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className={`w-full sm:w-1/2 md:w-1/3 px-4 mb-8 ${member.name === "Adithya" ? "flex justify-center" : ""}`}
                        >
                            <div className={`team-item bg-gray-800 p-6 rounded-lg shadow-lg ${member.name === "Adithya" ? "max-w-md" : ""}`}>
                                <img
                                    src={member.imgSrc}
                                    className='w-40 h-40 object-cover rounded-full mb-4 mx-auto'
                                    alt={member.name}
                                />
                                <h3 className='text-2xl font-semibold mb-2 text-center'>{member.name}</h3>
                                <p className='text-gray-400 mb-4 text-center'>{member.role}</p>
                                <p className='bg-gray-900 text-yellow-500 p-4 mb-4 text-justify rounded-lg'>
                                    {member.description}
                                </p>
                                <ul className='flex space-x-6 justify-center'>
                                    <li>
                                        <a href={member.linkedin} className='text-blue-400 hover:text-blue-600 text-2xl'>
                                            <i className='fa fa-linkedin'></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href={member.instagram} className='text-pink-400 hover:text-pink-600 text-2xl'>
                                            <i className='fa fa-instagram'></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href={member.github} className='text-white hover:text-gray-300 text-2xl'>
                                            <i className='fa fa-github'></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Team;
