import { useEffect, useState, useCallback, useContext } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { getAllStudents } from "../../redux/store/actions/user";
import { SignupFormData } from "../../types";
import UsersList from "./UsersList";
import LoadingSpinner from "../common/loadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import ManageUserModal from "./ManageUserModal";
import { unblockBlockUser } from "../../redux/store/actions/user/unblockBlockUser";
import { SocketContext } from "../../context/SocketProvider";
import { ToastService } from "../common/Toast/ToastifyV1";




const AdminStudents = () => {
    const socketContext = useContext(SocketContext);
    const socket = socketContext?.socket;
    const dispatch = useAppDispatch();
    const [students, setStudents] = useState<SignupFormData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser , setSelectedUser ] = useState<SignupFormData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const resultAction = await dispatch(getAllStudents({ page: currentPage, limit: 10 }));
            console.log(resultAction.payload.data);

            if (getAllStudents.fulfilled.match(resultAction)) {
                const studentsData = resultAction.payload.data;
                if (studentsData.length > 0) {
                    const verifiedStudents = studentsData.filter(
                        (data: SignupFormData) => data.isVerified
                    );
                    setStudents(verifiedStudents);
                } else if (currentPage > 1) {
                    setCurrentPage((prevPage) => prevPage - 1);
                }
            } else {
                throw new Error("Failed to fetch students");
            }
        } catch (err) {
            console.error("Error fetching students:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred"
            );
        } finally {
            setLoading(false);
        }
    }, [dispatch, currentPage]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser (null);
    };
    const handleEditClick = (user: SignupFormData) => {
        setSelectedUser (user);
        setIsModalOpen(true);
    };
    const handleToggleBlock = async() => {
        try{
        if (selectedUser ) {
            const response = await dispatch(unblockBlockUser({ ...selectedUser,isBlocked:!selectedUser.isBlocked}));
            if (response.payload.success) {
                if(socket && !selectedUser.isBlocked) {
                    socket.emit("block-user",{userId: selectedUser?._id});
                    // console.log(`emitted block user event for the user ${user._id}`);
                  }else{
                    console.log("socket is not availabele");
                  }
                ToastService.success(`${selectedUser.email} ${selectedUser?.isBlocked ? "unblocked" : "blocked"} successfully!`);
                fetchStudents();
            } else {
                ToastService.error(`Failed to ${selectedUser?.isBlocked? "unblock" : "block"} instructor`);
            }
            handleCloseModal();
        }
    }
    catch(error:unknown){
        ToastService.error(String(error));
    }
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };
    
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Students
            </h2>

            {error && (
                <div className="mb-4">
                    <ErrorMessage
                        message={error}
                        type="error"
                    />
                </div>
            )}
    
            {isModalOpen && (
                <ManageUserModal 
                    user={selectedUser } 
                    onClose={handleCloseModal} 
                    onToggleBlock={handleToggleBlock}
                />
            )}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <UsersList
                    users={students}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    onEdit={(user)=>handleEditClick(user)}
                    currentPage={currentPage}
                />
            )}
        </div>
    );
};

export default AdminStudents;
