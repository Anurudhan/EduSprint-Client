import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import LogoCondent from "../../assets/Screenshot 2024-09-30 112131_processed.png";
import {
  LayoutDashboard,
  BookOpen,
  UserCircle,
  ClipboardList,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  LucideIcon,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux';
import { logoutAction } from '../../redux/store/actions/auth';
import ConfirmationModal from '../common/ConfirmationModal';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface SidebarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const UserSidebar: React.FC<SidebarProps> = ({ isDarkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems: NavItemProps[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: BookOpen, label: 'My Courses', path: '/student/mycourses' },
    { icon: ClipboardList, label: 'Courses', path: '/student/allcourse' },
    { icon: Calendar , label: 'Assessments', path: '/student/Assessments' },
    { icon: MessageCircle, label: 'Chat Support', path: '/student/chat' },
    { icon: Settings, label: 'Settings', path: '/student/settings' },
    { icon: UserCircle, label: 'Profile', path: '/student/profile' },
    // { icon: Calendar, label: 'Schedule', path: '/student/schedule' },
    // { icon: Trophy, label: 'Achievements', path: '/student/achievements' },
    // { icon: Rocket, label: 'Learning Path', path: '/student/learning-path' },
  ];

  useEffect(() => {
    // Apply dark or light theme classes to the document root
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleSidebar = (): void => {
    setIsOpen(!isOpen);
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
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

  const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, path }) => (
    <NavLink
      to={path}
      className={({ isActive }) => `
        flex items-center px-4 py-3 text-gray-700 dark:text-gray-200
        transition-colors duration-200 gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg
        ${isActive ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}
      `}
      onClick={() => window.innerWidth < 768 && setIsMobileMenuOpen(false)}
    >
      <Icon size={20} />
      <span className={`${!isOpen && 'hidden'} transition-all duration-200`}>
        {label}
      </span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        onClick={toggleSidebar}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-40 h-full
          ${isOpen ? 'w-64' : 'w-20'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-all duration-300
          bg-white dark:bg-gray-800 shadow-xl
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-6">
            <div className={`${isOpen ? 'active' : 'hidden'} flex items-center`}>
              <img
                src={LogoCondent}
                alt="EduSprint"
                className="h-24 w-48"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = 'https://via.placeholder.com/32';
                }}
              />
            </div>
            <button
              onClick={toggleSidebar}
              className="hidden md:block"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-4 py-3 gap-4 text-gray-700 dark:text-gray-200
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              <span className={`${!isOpen && 'hidden'}`}>
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
            <button
              className="flex items-center w-full px-4 py-3 mt-2 gap-4
                text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                rounded-lg transition-colors duration-200"
                onClick={handleLogout}
            >
              <LogOut size={20} />
              <span className={`${!isOpen && 'hidden'}`}>Logout</span>
            </button>
          </div>
        </div>
      </aside>
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
    </>
  );
};

export default UserSidebar;
