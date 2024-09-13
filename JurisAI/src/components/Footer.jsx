import React from 'react';
import { Instagram, Github, Linkedin } from '../utils';

const Footer = () => {
  return (
    <footer id='contactus' className="bg-gray-800 text-white py-6">
      {/* Top Section with Links */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start px-5 sm:px-10">

        {/* About Section */}
        <div className="mb-4 md:mb-0 w-full md:w-2/3">
          <h3 className="font-bold text-base mb-2">JurisAI</h3>
          <p className="text-sm text-justify">
            JurisAI is a project developed exclusively for the Smart India Hackathon (SIH) and the Department of Justice, India. Our mission is to enhance legal assistance through advanced AI technologies, delivering efficient, reliable, and accessible solutions tailored to the needs of legal professionals and the public. This initiative represents our commitment to leveraging innovation to support and streamline judicial processes.
          </p>
        </div>

        {/* Contact Information Section */}
        <div className="mb-4 ml-52 md:mb-0 w-full md:w-1/3">
          <h3 className="font-bold text-base mb-2">Contact Information</h3>
          <ul className="text-sm space-y-1">
            <li>
              Email: <a href="mailto:jurisai@gmail.com" className="hover:underline">jurisai@gmail.com</a>
            </li>
          </ul>

          {/* Social Links */}
          <div className="flex space-x-4 mt-4">
            <a href="https://github.com/renaissance0ne/" target="_blank" rel="noopener noreferrer">
              <img src={Github} alt="GitHub" className="w-8 h-8 hover:opacity-75" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={Instagram} alt="Instagram" className="w-8 h-8 hover:opacity-75" />
            </a>
            <a href="https://www.linkedin.com/in/vallabh-dasari-22b5b92a6/" target="_blank" rel="noopener noreferrer">
              <img src={Linkedin} alt="LinkedIn" className="w-8 h-8 hover:opacity-75" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section with Copyright */}
      <div className="border-t border-gray-700 mt-6 pt-4">
        <div className="container mx-auto text-center text-xs px-5">
          © {new Date().getFullYear()} JurisAI.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
