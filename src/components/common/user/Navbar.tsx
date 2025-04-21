import { useEffect, useState } from 'react';
import logo from "../../../assets/Screenshot 2024-09-30 112131_processed.png";
import Profile from "../../../assets/Normal_profile.png";
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux';
import { logoutAction } from '../../../redux/store/actions/auth';
import MessageToast from '../Toast/MessageToast';
import { MessageType } from '../../../types/IMessageType';
import ConfirmationModal from '../Toast/ConfirmationModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [message, setMessage] = useState("");
  const [type, setType] = useState<MessageType>("error");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.data);

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

  const DashboardLink = () => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!userData?.isRequested) {
        setMessage("Please fill the register form!");
        setType("info");
      } else if (userData?.isVerified) {
        navigate(`/${userData.role}/dashboard`);
      } else {
        setMessage("Please wait for eduSprint while your data is being verified.");
        setType("info");
      }
    };

    return (
      <a
        href="#"
        onClick={handleClick}
        className="text-gray-900 dark:text-gray-100 text-sm h-10 w-28 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-green-600 dark:hover:text-green-400 border border-gray-300 dark:border-gray-500 hover:border-green-600 dark:hover:border-green-500 transition-all duration-300"
      >
        Dashboard
      </a>
    );
  };

  const handleMessage = async (Message: string): Promise<void> => {
    setMessage(Message);
  };

  const handleLogout = () => setIsLogoutModalOpen(true);
  const confirmLogout = () => {
    dispatch(logoutAction());
    navigate('/home');
    setIsLogoutModalOpen(false);
  };
  const cancelLogout = () => setIsLogoutModalOpen(false);

  const navItems = !userData
    ? [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
        { name: 'Teach Us', path: '/teach-us' },
        { name: 'Contact Us', path: '/contact-us' },
        { name: 'About Us', path: '/about-us' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
        ...(userData.isRequested ? [] : [{ name: 'Register', path: `/${userData.role}-form` }]),
        { name: 'About Us', path: '/about-us' },
      ];

  const avatar = userData?.profile?.avatar as string;

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-transparent backdrop-blur-sm z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img className="h-12 sm:h-14 lg:h-16 w-auto transition-transform duration-300 hover:scale-105" src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Desktop/Laptop Menu */}
          <div className="hidden lg:flex items-center justify-between w-full ml-6">
            <div className="flex items-center space-x-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-900 dark:text-gray-100 text-sm h-10 w-24 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-green-600 dark:hover:text-green-400 border border-gray-300 dark:border-gray-500 hover:border-green-600 dark:hover:border-green-500 transition-all duration-300"
                >
                  {item.name}
                </Link>
              ))}
              {userData && <DashboardLink />}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative w-56 md:w-64">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400/50 rounded-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-500 focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300" />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleTheme}
                  className="text-gray-900 dark:text-gray-100 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-green-600 dark:hover:text-green-400 border border-gray-300 dark:border-gray-500 hover:border-green-600 dark:hover:border-green-500 transition-all duration-300"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                
                {userData ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <img
                        className="h-10 w-10 rounded-full border-2 border-gray-300 dark:border-gray-500 hover:border-green-600 dark:hover:border-green-500 transition-all duration-300"
                        src={userData ? avatar : Profile}
                        alt="Profile"
                      />
                      <span className="text-gray-900 dark:text-gray-100 text-sm hidden md:block">{userData.userName}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-gray-900 dark:text-gray-100 text-sm h-10 w-24 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-500 hover:border-red-600 dark:hover:border-red-500 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-900 dark:text-gray-100 text-sm h-10 w-24 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-green-600 dark:hover:text-green-400 border border-gray-300 dark:border-gray-500 hover:border-green-600 dark:hover:border-green-500 transition-all duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="text-gray-900 dark:text-gray-100 text-sm h-10 w-24 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-green-600 dark:hover:text-green-400 border border-gray-300 dark:border-gray-500 hover:border-green-600 dark:hover:border-green-500 transition-all duration-300"
                    >
                      Signup
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-900 dark:text-gray-100 text-sm h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-green-600 dark:hover:text-green-400 border border-gray-300 dark:border-gray-500 hover:border-green-600 dark:hover:border-green-500 transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-transparent backdrop-blur-sm">
          <div className="px-4 pt-4 pb-6 space-y-3 flex flex-col items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-900 dark:text-gray-100 text-sm h-10 w-28 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-green-600 dark:hover:text-green-400 border border-gray-300 dark:border-gray-500 hover:border-green-600 dark:hover:border-green-500 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {userData ? (
              <>
                <DashboardLink />
                <button
                  onClick={handleLogout}
                  className="text-gray-900 dark:text-gray-100 text-sm h-10 w-28 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-500 hover:border-red-600 dark:hover:border-red-500 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-900 dark:text-gray-100 text-sm h-10 w-28 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-green-600 dark:hover:text-green-400 border border-gray-300 dark:border-gray-500 hover:border-green-600 dark:hover:border-green-500 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-900 dark:text-gray-100 text-sm h-10 w-28 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-green-600 dark:hover:text-green-400 border border-gray-300 dark:border-gray-500 hover:border-green-600 dark:hover:border-green-500 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signup
                </Link>
                <button
                  onClick={toggleTheme}
                  className="text-gray-900 dark:text-gray-100 text-sm h-10 w-28 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-green-600 dark:hover:text-green-400 border border-gray-300 dark:border-gray-500 hover:border-green-600 dark:hover:border-green-500 transition-all duration-300"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        isError={true}
      />

      {message && (
        <MessageToast
          message={message}
          type={type}
          onMessage={(Message) => handleMessage(Message)}
        />
      )}
    </nav>
  );
};

export default Navbar;