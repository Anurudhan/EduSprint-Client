
import { 
  Mail, Phone, MapPin, Calendar, BookOpen, 
  Award, Clock, Star, Edit, Camera 
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import EditProfileModal, {FormValues} from '../../components/user/EditProfileModal';
import { useState } from 'react';
interface StatCardProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // type for the icon component
    label: string;
    value: string | number; // value can be a string or number
  }
const StudentProfile = () => {
    const {data} = useSelector((state: RootState) => state.user);

    const [isModalOpen, setModalOpen] = useState(false);

  const handleEditProfile = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFormSubmit = (values:FormValues) => {
    console.log('Form submitted with values:', values);
    // Handle form submission here, such as updating the user's data in the backend
  };
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 gap-4">
            <div className="relative">
              <img
                src={String(data?.profile?.avatar)}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg">
                <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{data?.firstName}  {data?.lastName}</h1>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Computer Science Student</p>
            </div>
            <button onClick={handleEditProfile} className="btn btn-primary">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="card">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">About Me</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Passionate computer science student with a focus on web development and artificial intelligence. 
              Always eager to learn new technologies and solve complex problems.
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Learning Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard icon={Clock} label="Study Hours" value="156" />
              <StatCard icon={BookOpen} label="Courses Completed" value="12" />
              <StatCard icon={Award} label="Certificates" value="8" />
              <StatCard icon={Star} label="Average Rating" value="4.8" />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contact Information</h2>
            <div className="space-y-3">
              <InfoItem icon={Mail} label="Email" value={String(data?.email)} />
              <InfoItem icon={Phone} label="Phone" value={String(data?.contact?.phone)} />
              <InfoItem icon={MapPin} label="Location" value={String(data?.contact?.address)}  />
              <InfoItem icon={Calendar} label="Birthday" value={String(data?.profile?.dateOfBirth)} />
            </div>
          </section>

          <section className="card">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {['JavaScript', 'React', 'Python', 'Node.js', 'HTML/CSS', 'Git'].map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
      <EditProfileModal 
  isOpen={isModalOpen} 
  onClose={handleCloseModal} 
  onSubmit={handleFormSubmit}
  initialValues={{
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    email: data?.email || '',
    profile: {
      dateOfBirth: data?.profile?.dateOfBirth || '',
    },
    userName: data?.userName || '',
    contact: {
      address: data?.contact?.address || '',
      phone: data?.contact?.phone || '',
    },
    password: '', // Leaving password blank initially
  }}
/>

    </div>
  );
};

  

const StatCard = ({ icon: Icon, label, value }: StatCardProps) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }: StatCardProps) => {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default StudentProfile;