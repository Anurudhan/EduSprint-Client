import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import LogoCondent from "../../assets/Screenshot 2024-09-30 112131_processed.png";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  Receipt,
  Image,
  UserPlus,
  AlertCircle,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  LucideIcon,
  Folders,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux';
import { logoutAction } from '../../redux/store/actions/auth';
import ConfirmationModal from '../common/ConfirmationModal';
import { useAppSelector } from '../../hooks/hooks';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface SidebarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isDarkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { data } = useAppSelector((state: RootState) => state.user);

  const menuItems: NavItemProps[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
    { icon: Users, label: 'Manage Users', path: '/admin/users' },
    { icon: ClipboardList, label: 'Assessments', path: '/admin/assessments' },
    { path: '/admin/categories', icon: Folders, label: 'Categories' },
    { icon: Receipt, label: 'Transactions', path: '/admin/transactions' },
    { icon: Image, label: 'Banners', path: '/admin/banners' },
    { icon: UserPlus, label: 'Requests', path: '/admin/requests' },
    { icon: AlertCircle, label: 'Complaints', path: '/admin/complaints' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
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
          <div className={`
            ${isOpen ? 'px-4 py-2' : 'hidden'}
            border-b dark:border-gray-700 mb-4
          `}>
            <div className="flex items-center space-x-4">
              <img
                src={String(data?.profile?.avatar)}
                alt="Instructor"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                  {data?.userName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supper Admin
                </p>
              </div>
            </div>
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

export default AdminSidebar;
