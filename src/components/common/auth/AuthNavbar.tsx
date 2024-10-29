import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import logo from "../../../assets/Screenshot 2024-09-30 112131_processed.png";

const AuthNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-10 ">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-1">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/">
              <img className="h-16 sm:h-24 lg:h-28 w-auto" src={logo} alt="Logo" />
            </Link>
          </div>

          <div className="lg:hidden flex items-center">
            <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 dark:text-gray-300">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <button onClick={toggleTheme} className="dark:text-white text-green-800 p-2 rounded-full">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute bg-gray-800 bg-opacity-80 rounded-lg shadow-lg mt-2 w-48">
            <div className="px-4 py-3 space-y-1">
              <Link to="/login" className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                Login
              </Link>
              <Link to="/signup" className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                Sign Up
              </Link>
              <button onClick={toggleTheme} className="flex items-center w-full px-3 py-2 text-gray-300">
                {isDarkMode ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AuthNavbar;
