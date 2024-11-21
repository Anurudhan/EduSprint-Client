import { CheckCircle, XCircle, Eye } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SignupFormData } from "../../types";
import { useAppDispatch } from "../../hooks/hooks";
import { getAllInstructors } from "../../redux/store/actions/user";
import LoadingSpinner from "../../components/common/loadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import InstructorDetailsModal from "./InstructorDeatailModal";
import { verifyInstructor } from "../../redux/store/actions/user/verifyInstructor";
import MessageToast from "../../components/common/MessageToast";
import { MessageType } from "../../types/IMessageType";

const Requests = () => {
  const dispatch = useAppDispatch();
  const [instructors, setInstructors] = useState<SignupFormData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<MessageType>("error");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInstructor, setSelectedInstructor] =
    useState<SignupFormData | null>(null);
  const fetchInstructors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const resultAction = await dispatch(
        getAllInstructors({ page: currentPage, limit: 10 })
      );
      console.log(resultAction.payload.data);

      if (getAllInstructors.fulfilled.match(resultAction)) {
        const studentsData = resultAction.payload.data;
        if (studentsData.length > 0) {
          const verifiedStudents = studentsData.filter(
            (data: SignupFormData) => !data.isVerified
          );
          setInstructors(verifiedStudents);
        } else if (currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }
      } else {
        throw new Error("Failed to fetch students");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch, currentPage]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  const handleViewDetails = (instructor: SignupFormData) => {
    setSelectedInstructor(instructor);
  };
  const handleMessage = async (Message: string): Promise<void> => {
    setMessage(Message);
  };

  // Handler to close details modal
  const handleCloseDetailsModal = () => {
    setSelectedInstructor(null);
  };
  const handleVerify = async (
    actionType: string,
    instructor: SignupFormData
  ) => {
    try {
      const verification = !instructor.isVerified;
      const reject = !instructor.isRejected;
      let resultAction;
      setLoading(true);
      if (actionType == "approove") {
        resultAction = await dispatch(
          verifyInstructor({ ...instructor, isVerified: verification,isRejected:false })
        );
      } else {
        resultAction = await dispatch(
          verifyInstructor({ ...instructor, isRejected: reject })
        );
      }
      if (verifyInstructor.fulfilled.match(resultAction)) {
        // Optionally show a success message or update the UI
        fetchInstructors();
        setMessage(`instructor ${actionType} successfully:`);
        setType("success");
      } else {
        setMessage(`Instructor ${actionType} failed `);
        setType("error");
      }
      setLoading(false);
    } catch (error) {
      console.error(`${actionType} failed:`, error);
      setMessage(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setType("error");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">
        Instructor Requests
      </h1>

      <div className="grid gap-6">
        {instructors.map((request) => (
          <div
            key={request?._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <img
                  src={String(request?.profile?.avatar)}
                  alt={request.userName}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold dark:text-white">
                    {request.userName}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {request.email}
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                {request.isRejected?"rejected":!request.isVerified ? "pending" : "approoved"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Specialization
                </p>
                <p className="font-medium dark:text-white">
                  {request.qualification
                    ? request.qualification
                    : "Computer Science"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Teaching Experience
                </p>
                <p className="font-medium dark:text-white">5 years</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => handleVerify("approove", request)}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Approve
              </button>
              {!request.isRejected&&(<button
                onClick={() => handleVerify("reject", request)}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Decline
              </button>)}
              <button
                onClick={() => handleViewDetails(request)}
                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4 px-4 py-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm font-medium ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-800"
          } dark:text-blue-400 dark:hover:text-blue-300`}
        >
          Previous
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Page {currentPage}
        </span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Next
        </button>
      </div>
      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} type="error" />
        </div>
      )}
      {loading && <LoadingSpinner />}
      {message && (
        <MessageToast
          message={message}
          type={type}
          onMessage={(Message) => handleMessage(Message)}
        />
      )}
      {selectedInstructor && (
        <InstructorDetailsModal
          instructor={selectedInstructor}
          onClose={handleCloseDetailsModal}
        />
      )}
    </div>
  );
};

export default Requests;
