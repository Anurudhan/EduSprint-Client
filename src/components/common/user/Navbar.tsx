import { useEffect, useState } from 'react';
import logo from "../../../assets/Screenshot 2024-09-30 112131_processed.png";
import Profile from "../../../assets/Normal_profile.png";
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux';
import { logoutAction } from '../../../redux/store/actions/auth';
import MessageToast from '../MessageToast';
import { MessageType } from '../../../types/IMessageType';
import ConfirmationModal from '../ConfirmationModal';



const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [message, setMessage] = useState("");
  const [type, setType] = useState<MessageType>("error");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.data); // Select user data from the Redux state

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
      if(!userData?.isRequested){
        setMessage("Please fill the register form!");
        setType("info");
      }
      else if (userData?.isVerified) {
        navigate(`/${userData.role}/dashboard`);
      } else {
        console.log("Setting message for unverified user"); // Debug log
        setMessage("Please wait for eduSprint while your data is being verified.");
        setType("info");
      }
    };

    return (
      <a 
        href="#" 
        onClick={handleClick}
        className="text-green-800 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
      >
        Dashboard
      </a>
    );
  };
  
  const handleMessage = async (Message: string): Promise<void> => {
    setMessage(Message);
  };
  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

   const confirmLogout = () => {
    dispatch(logoutAction());
    navigate('/home');
    setIsLogoutModalOpen(false);
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };


  const navItems = !userData?[
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Teach Us', path: '/teach-us' },
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'About Us', path: '/about-us' },
  ]:[
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    ...(userData.isRequested
      ? [] 
      : [{ name: 'Register', path: `/${userData.role}-form` }]),
    { name: 'About Us', path: '/about-us' },
  ];
const avatar = userData?.profile?.avatar as string; 
  return (
    <nav className={`fixed top-0 left-0 right-0 w-full bg-white dark:bg-black shadow-lg z-10`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-1">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/">
              <img className="h-16 sm:h-24 lg:h-28 w-auto" src={logo} alt="Logo" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center justify-between flex-1 ml-6">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path} className="text-green-800 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                  {item.name}
                </Link>
              ))}
              {userData&&<DashboardLink/>}
            </div>

            <div className="relative w-64">
              <input type="text" placeholder="Search..." className="w-full bg-gray-100 dark:bg-gray-700 rounded-full pl-10 pr-4 py-2" />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center space-x-4">
              {userData ? ( // Check if userData is available
                <>
                  <img className="h-8 w-8 rounded-full" src={userData?avatar:Profile} alt="Profile" />
                  <span className="text-green-800 dark:text-gray-300">{userData.userName}</span>
                  <button className="p-2 rounded-full dark:text-gray-300" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-green-800 dark:text-gray-300">Login</Link>
                  <Link to="/signup" className="text-green-800 dark:text-gray-300">Signup</Link>
                </>
              )}
              <button className="p-2 rounded-full" onClick={toggleTheme}>
                {isDarkMode ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 dark:text-gray-300">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onConfirm={confirmLogout  }
        onCancel={cancelLogout}
        isError={true}
      />

      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path} className="block px-3 py-2 text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      {message&&(
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
