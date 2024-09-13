import { appleImg } from '../utils';
import { navLists } from '../constants';

const Navbar = () => {
  return (
    <header className='w-full py-5 sm:px-10 px-5 flex justify-between items-center'>
      <nav className='flex w-full max-w-screen-xl mx-auto'>
        <img src={appleImg} alt="befit" width={35} height={35} className='text-white' />
        <div className='flex flex-1 justify-center items-center space-x-5'>
          {navLists.map((nav, i) => {
            // Convert nav name to lowercase and replace spaces with hyphens
            const sectionId = nav.replace(/\s+/g, '').toLowerCase();
            return (
              <a
                key={i}
                href={`#${sectionId}`}
                className='px-5 text-lg cursor-pointer text-gray-500 hover:text-white transition-all'
              >
                {nav}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
