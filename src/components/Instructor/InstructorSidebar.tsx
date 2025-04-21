import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  // Users,
  // ClipboardList,
  // Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  type LucideIcon,
  MessageCircle,
  // TrendingUp,
  // Calendar,
  // FileText,
  DollarSign,
  // Award,
  // Video,
  // Bell,
  // BookMarked,
  UserCog,
} from 'lucide-react';
import ConfirmationModal from '../common/Toast/ConfirmationModal';
import { logoutAction } from '../../redux/store/actions/auth';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux';
import { useAppSelector } from '../../hooks/hooks';
import LogoCondent from "../../assets/Screenshot 2024-09-30 112131_processed.png";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
}

interface SidebarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const InstructorSidebar: React.FC<SidebarProps> = ({ isDarkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data } = useAppSelector((state: RootState) => state.user);
//   const [notifications, setNotifications] = useState(5); // Demo notification count
  const navigate = useNavigate(); 
  const dispatch = useDispatch<AppDispatch>();  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems: NavItemProps[] = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/instructor/dashboard'
    },
    { 
      icon: BookOpen, 
      label: 'My Courses', 
      path: '/instructor/mycourses'
    },
    // { 
    //   icon: Video, 
    //   label: 'Live Sessions', 
    //   path: '/instructor/live-sessions',
    //   badge: 2 // Demo: Upcoming sessions
    // },
    // { 
    //   icon: Users, 
    //   label: 'Students', 
    //   path: '/instructor/students',
    //   badge: 156 // Demo: Total enrolled students
    // },
    // { 
    //   icon: ClipboardList, 
    //   label: 'Assessments', 
    //   path: '/instructor/assessments',
    //   badge: 3 // Demo: Pending assessments
    // },
    // { 
    //   icon: FileText, 
    //   label: 'Course Materials', 
    //   path: '/instructor/materials'
    // },
    // { 
    //   icon: Calendar, 
    //   label: 'Schedule', 
    //   path: '/instructor/schedule',
    //   badge: 4 // Demo: Today's events
    // },
    // { 
    //   icon: TrendingUp, 
    //   label: 'Analytics', 
    //   path: '/instructor/analytics'
    // },
    { 
      icon: DollarSign, 
      label: 'Earnings', 
      path: '/instructor/earnings'
    },
    { 
      icon: MessageCircle, 
      label: 'Messages', 
      path: '/instructor/messages',
      // badge: 8 
    },
    // { 
    //   icon: Award, 
    //   label: 'Certifications', 
    //   path: '/instructor/certifications'
    // },
    // { 
    //   icon: BookMarked, 
    //   label: 'Resources', 
    //   path: '/instructor/resources'
    // },
    // { 
    //   icon: Bell, 
    //   label: 'notifications', 
    //   path: '/instructor/notifications',
    //   // badge: 5
    // },
    { 
      icon: UserCog, 
      label: 'Profile', 
      path: '/instructor/profile'
    },
    // { 
    //   icon: Settings, 
    //   label: 'Settings', 
    //   path: '/instructor/settings'
    // },
  ];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => {
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
  const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, path, badge }) => (
    <NavLink
      to={path}
      className={({ isActive }) => `
        flex items-center px-4 py-3 text-gray-700 dark:text-gray-200
        transition-colors duration-200 gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg
        ${isActive ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}
        relative
      `}
      onClick={() => window.innerWidth < 768 && setIsMobileMenuOpen(false)}
    >
      <Icon size={20} />
      <span className={`${!isOpen && 'hidden'} transition-all duration-200 flex-1`}>
        {label}
      </span>
      {badge && badge > 0 && (
        <span className={`
          ${!isOpen && 'hidden'}
          absolute right-4 bg-red-500 text-white text-xs font-bold
          px-2 py-1 rounded-full min-w-[20px] text-center
        `}>
          {badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        onClick={toggleSidebar}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-40 h-full
          ${isOpen ? 'w-72' : 'w-20'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-all duration-300
          bg-white dark:bg-gray-800 shadow-xl
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-6">
            <div className={`${isOpen ? 'block' : 'hidden'} flex items-center`}>
            <img
                src={LogoCondent}
                alt="EduSprint"
                className="h-24 w-48 "
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = 'https://via.placeholder.com/32';
                }}
              />
            </div>
            <button
              onClick={toggleSidebar}
              className="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  Senior Instructor
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </nav>

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
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 mt-2 gap-4
                text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                rounded-lg transition-colors duration-200"
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

export default InstructorSidebar;