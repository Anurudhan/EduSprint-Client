import React, { useState } from 'react';
import {
  FaTachometerAlt,
  FaBook,
  FaUserGraduate,
  FaComments,
  FaChalkboardTeacher,
  FaUsers,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaBars
} from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux';
import { logoutAction } from '../../../redux/store/actions/auth';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom

interface SidebarLink {
  name: string;
  icon: JSX.Element;
  path: string; // Add path property for routing
}

const UserSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // Collect userData from Redux
  const userData = useSelector((state: RootState) => state.user.data);

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Links based on user roles
  const getLinksForRole = (): SidebarLink[] => {
    switch (userData?.role) {
      case 'student':
        return [
          { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/student/dashboard' },
          { name: 'Courses', icon: <FaBook />, path: '/student/courses' },
          { name: 'Exams', icon: <FaUserGraduate />, path: '/student/exams' },
          { name: 'Chat', icon: <FaComments />, path: '/student/chat' },
        ];
      case 'instructor':
        return [
          { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/instructor/dashboard' },
          { name: 'Courses', icon: <FaBook />, path: '/instructor/courses' },
          { name: 'Exams', icon: <FaUserGraduate />, path: '/instructor/exams' },
          { name: 'Chat', icon: <FaComments />, path: '/instructor/chat' },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/admin/dashboard' },
          { name: 'Instructors', icon: <FaChalkboardTeacher />, path: '/admin/instructors' },
          { name: 'Students', icon: <FaUsers />, path: '/admin/students' },
          { name: 'Courses', icon: <FaBook />, path: '/admin/courses' },
          { name: 'Chat', icon: <FaComments />, path: '/admin/chat' },
        ];
      default:
        return [];
    }
  };

  const sidebarLinks = getLinksForRole();
  const avatar = userData?.profile?.avatar as string;

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      dispatch(logoutAction());
      navigate('/home')
    }
  };

  return (
    <div className={`flex flex-col h-screen bg-gray-900 text-white ${isCollapsed ? 'w-20' : 'w-64'} transition-width duration-300`}>

      {/* User Info Section */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <img
          src={avatar} // Use your user's profile image URL here
          alt="User"
          className="w-10 h-10 rounded-full"
        />
        {!isCollapsed && <span className="ml-2">{userData?.userName}</span>}
      </div>

      <button
        className="p-4 focus:outline-none text-center"
        onClick={toggleSidebar}
      >
        <FaBars className="text-xl" /> {/* Font Awesome Bars icon for toggle */}
      </button>

      {/* Sidebar Menu */}
      <ul className="flex-grow">
        {sidebarLinks.map((link, index) => (
          <li key={index} className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
            <Link to={link.path} className="flex items-center w-full">
              <span className="text-xl mr-4">{link.icon}</span>
              {!isCollapsed && <span className="text-base">{link.name}</span>}
            </Link>
          </li>
        ))}
      </ul>

      {/* Theme Toggle */}
      <div className="flex items-center p-4 hover:bg-gray-700 cursor-pointer" onClick={() => alert('Toggle theme here')}>
        {localStorage.getItem('theme') === 'dark' ? (
          <FaSun className="text-xl" />
        ) : (
          <FaMoon className="text-xl" />
        )}
      </div>

      {/* Logout Button */}
      {userData && (
        <div className="flex items-center p-4 hover:bg-gray-700 cursor-pointer" onClick={handleLogout}>
          <FaSignOutAlt className="text-xl" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </div>
      )}
    </div>
  );
};

export default UserSidebar;
