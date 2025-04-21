import { useEffect, useState, useCallback, useContext, useRef } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { getAllInstructors } from "../../redux/store/actions/user";
import { SignupFormData } from "../../types";
import UsersList from "./UsersList";
import LoadingSpinner from "../common/loadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import ManageUserModal from "./ManageUserModal";
import { unblockBlockUser } from "../../redux/store/actions/user/unblockBlockUser";
import { SocketContext } from "../../context/SocketProvider";
import { ToastService } from "../common/Toast/ToastifyV1";
import SearchInput from "../common/Search/searchInput";
import PaginationV1 from "../common/Pagination/PaginationV1";
import { useLocation, useNavigate } from "react-router-dom";

const AdminInstructors = () => {
    const socketContext = useContext(SocketContext);
    const socket = socketContext?.socket;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Parse query params manually - don't use hooks that cause re-renders
    const getQueryParams = () => {
        const searchParams = new URLSearchParams(location.search);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const search = searchParams.get("search") || "";
        return { page, search };
    };
    
    // Constants
    const ITEMS_PER_PAGE = 10;
    
    // State for component data
    const [instructors, setInstructors] = useState<SignupFormData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<SignupFormData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    
    // Use a ref to track the latest params to avoid stale closures
    const latestParamsRef = useRef(getQueryParams());
    
    // Update the ref whenever location changes
    useEffect(() => {
        latestParamsRef.current = getQueryParams();
    }, [location.search]);
    
    // Dedicated navigation function that works reliably
    const navigateToParams = useCallback((page: number, search: string = "") => {
        const queryParams = new URLSearchParams();
        queryParams.set("page", page.toString());
        
        if (search) {
            queryParams.set("search", search);
        }
        
        const newPath = `${location.pathname}?${queryParams.toString()}`;
        navigate(newPath, { replace: true });
    }, [navigate, location.pathname]);
    
    // Fetch instructors data based on current params
    const fetchInstructors = useCallback(async () => {
        const { page, search } = latestParamsRef.current;
        
        setLoading(true);
        setError(null);
        
        try {
            const resultAction = await dispatch(
                getAllInstructors({
                    page: page,
                    limit: ITEMS_PER_PAGE,
                    search: search,
                })
            );
            
            if (getAllInstructors.fulfilled.match(resultAction)) {
                const { data, totalCount, totalPages: pages } = resultAction.payload;
                
                if (data && Array.isArray(data)) {
                    const verifiedInstructors = data.filter(
                        (instructorData: SignupFormData) => instructorData.isVerified
                    );
                    
                    setInstructors(verifiedInstructors);
                    setTotalPages(pages || Math.ceil(totalCount / ITEMS_PER_PAGE) || 1);
                    setTotalItems(totalCount || verifiedInstructors.length);
                } else {
                    setInstructors([]);
                    setTotalPages(1);
                    setTotalItems(0);
                }
            } else {
                const errorPayload = resultAction.payload as { message: string };
                const errorMessage = errorPayload?.message || "Failed to fetch instructors";
                ToastService.error(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (err) {
            console.error("Error fetching instructors:", err);
            const message = err instanceof Error ? err.message : "An unexpected error occurred";
            setError(message);
            setInstructors([]);
        } finally {
            setLoading(false);
        }
    }, [dispatch]);
    
    // Re-fetch data when location.search changes
    useEffect(() => {
        fetchInstructors();
    }, [fetchInstructors, location.search]);
    
    // Handle pagination safely
    const handlePageChange = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages) {
            const { search } = latestParamsRef.current;
            navigateToParams(page, search);
        }
    }, [navigateToParams, totalPages]);
    
    // Handle search safely
    const handleSearch = useCallback((query: string) => {
        navigateToParams(1, query);
    }, [navigateToParams]);
    
    // Modal handlers
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };
    
    const handleEditClick = (user: SignupFormData) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };
    
    const handleToggleBlock = async () => {
        try {
            if (selectedUser) {
                const response = await dispatch(
                    unblockBlockUser({
                        ...selectedUser,
                        isBlocked: !selectedUser.isBlocked,
                    })
                );
                
                if (response.payload.success) {
                    if (socket && !selectedUser.isBlocked) {
                        socket.emit("block-user", { userId: selectedUser?._id });
                    }
                    
                    ToastService.success(
                        `${selectedUser.email} ${
                            selectedUser?.isBlocked ? "unblocked" : "blocked"
                        } successfully!`
                    );
                    
                    // Refresh data after action
                    fetchInstructors();
                } else {
                    ToastService.error(
                        `Failed to ${selectedUser?.isBlocked ? "unblock" : "block"} instructor`
                    );
                }
                
                handleCloseModal();
            }
        } catch (error: unknown) {
            ToastService.error(String(error));
        }
    };
    
    // Get current params for rendering
    const { page: currentPage, search: currentSearch } = getQueryParams();
    
    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-white mb-2 md:mb-0">
                    Instructors
                </h2>
                <div className="w-full md:w-64">
                    <SearchInput
                        placeholder="Search instructors..."
                        onSearch={handleSearch}
                        debounceTime={500}
                        initialValue={currentSearch}
                        key={`search-${currentSearch}`} // Force re-render on search change
                    />
                </div>
            </div>
            
            {error && (
                <div className="mb-4">
                    <ErrorMessage message={error} type="error" />
                </div>
            )}
            
            {isModalOpen && selectedUser && (
                <ManageUserModal
                    user={selectedUser}
                    onClose={handleCloseModal}
                    onToggleBlock={handleToggleBlock}
                />
            )}
            
            {loading ? (
                <LoadingSpinner />
            ) : instructors.length > 0 ? (
                <>
                    <UsersList users={instructors} onEdit={handleEditClick} />
                    
                    <div className="mt-4">
                        <PaginationV1
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={totalItems}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
                    </div>
                </>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {currentSearch ? "No instructors match your search criteria." : "No instructors found."}
                </div>
            )}
        </div>
    );
};

export default AdminInstructors;