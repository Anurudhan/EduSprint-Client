import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Clock,
  Star,
  Edit,
  Camera,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useRef, useState } from "react";
import ChangePasswordModal from "../../components/common/auth/ChangePasswordModal";
import ForgotPasswordModal from "../../components/user/ForgotPasswordModal";
import {
  handleCloseChangePasswordModal,
  handleCloseModal,
  handleEditProfile,
  handleOpenChangePasswordModal,
  handleOpenForgotPasswordModal,
  toggleForgotPasswordModal,
} from "../../utilities/handler/user/StudentProfileHandler";
import { toast } from "react-toastify";
import { forgotPasswordMailAction } from "../../redux/store/actions/auth/forgotPasswordMailAction";
import { useAppDispatch } from "../../hooks/hooks";
import { MessageType } from "../../types/IMessageType";
import MessageToast from "../../components/common/MessageToast";
import { updateUser } from "../../redux/store/actions/user/updateUser";
import { SignupFormData } from "../../types";
import EditProfileModal from "../../components/user/EditProfileModal";
import { uploadToCloudinary } from "../../utilities/axios/claudinary";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/loadingSpinner";
interface StatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // type for the icon component
  label: string;
  value: string | number; // value can be a string or number
}
const StudentProfile = () => {
  const { data } = useSelector((state: RootState) => state.user);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] =
    useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<MessageType>("error");
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate()

  const handleForgotPasswordSubmit = async (email: string) => {
    try {
      const result = await dispatch(forgotPasswordMailAction(email));
      if (result) toast.success("Password reset link sent to your email.");
      else toast.error("Password reset link not generate.");
    } catch (error) {
      console.log(error);

      toast.error("Failed to send password reset link. Try again.");
    }
  };
  const handleMessage = async (Message: string): Promise<void> => {
    setMessage(Message);
  };

  const handleFormSubmit = async (values: SignupFormData) => {
    try {
      const profile = {
        dateOfBirth: values.profile?.dateOfBirth,
        avatar: data?.profile?.avatar,
        gender: data?.profile?.gender,
      };
      const contact = {
        phone: values?.contact?.phone,
        social: data?.contact?.social,
        address: values?.contact?.address,
      };
      const value = { ...values,_id:data?._id, profile: profile, contact: contact };
      const updateResult = await dispatch(updateUser(value));
      if (!updateResult?.payload?.success) {
        handleMessage("updating Profile failed. Please Try again!");
        setType("error");
      } else {
        handleMessage("Successfully updated your Profile.");
        setType("success");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      navigate("student/profile") 
      return ;
    }
    setIsLoading(true); 
    try {
        const avatar=await uploadToCloudinary(file);
    
      const profile={
      dateOfBirth: data?.profile?.dateOfBirth,
      avatar: avatar,
      gender: data?.profile?.gender,
    };
      const updateImage = await dispatch(updateUser({...data,profile:profile}))
      if (updateImage.payload.success) {
        handleMessage("Image updated success-fully")
        setType("success");
      } else {
        handleMessage("Image updating failed!")
        setType("error");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 gap-4">
            <div className="relative">
              <img
                src={String(data?.profile?.avatar)} // Use the updated state for the image URL
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
              />
              <button
                className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg"
                onClick={() => fileInputRef.current?.click()} // Trigger file input click
              >
                <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }} // Hide the file input
                onChange={handleImageUpload} // Handle file selection
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {data?.firstName} {data?.lastName}
                </h1>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Computer Science Student
              </p>
            </div>
            <button
              onClick={() => handleEditProfile(setModalOpen)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="card">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              About Me
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Passionate computer science student with a focus on web
              development and artificial intelligence. Always eager to learn new
              technologies and solve complex problems.
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Learning Statistics
            </h2>
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
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              <InfoItem icon={Mail} label="Email" value={String(data?.email)} />
              <InfoItem
                icon={Phone}
                label="Phone"
                value={String(data?.contact?.phone)}
              />
              <InfoItem
                icon={MapPin}
                label="Location"
                value={String(data?.contact?.address)}
              />
              <InfoItem
                icon={Calendar}
                label="Birthday"
                value={String(data?.profile?.dateOfBirth)}
              />
            </div>
          </section>

          <section className="card">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "JavaScript",
                "React",
                "Python",
                "Node.js",
                "HTML/CSS",
                "Git",
              ].map((skill) => (
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
        onClose={() => handleCloseModal(setModalOpen)}
        onChangePassword={() =>
          handleOpenChangePasswordModal(
            setModalOpen,
            setChangePasswordModalOpen
          )
        }
        onSubmit={handleFormSubmit}
        initialValues={{
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          email: data?.email || "",
          profile: {
            dateOfBirth: data?.profile?.dateOfBirth || "",
          },
          userName: data?.userName || "",
          contact: {
            address: data?.contact?.address || "",
            phone: data?.contact?.phone || "",
          },
        }}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onForgotPassword={() =>
          handleOpenForgotPasswordModal(
            setIsForgotPasswordOpen,
            setChangePasswordModalOpen
          )
        }
        onClose={() =>
          handleCloseChangePasswordModal(setChangePasswordModalOpen)
        }
        email={data?.email}
        role={data?.role}
        onMessage={(Message, Type) => {
          handleMessage(Message);
          setType(Type);
        }}
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() =>
          toggleForgotPasswordModal(
            setIsForgotPasswordOpen,
            isForgotPasswordOpen
          )
        }
        onSubmit={handleForgotPasswordSubmit}
      />
      {message && (
        <MessageToast
          message={message}
          type={type}
          onMessage={(Message) => handleMessage(Message)}
        />
      )}
      {isLoading && <LoadingSpinner />}
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
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {value}
        </p>
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
