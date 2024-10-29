import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getAllInstructorsAction } from '../../redux/store/actions/user';
import FallbackUI from '../../common/FallbackUI';
import { AppDispatch } from '../../redux';

interface Instructor {
    _id: string;
    firstName: string;
    createdAt: string;
    isVerified: boolean | null;
    isBlocked: boolean;
    profile: {
        avatar: string;
    };
    cv: string;
    email: string;
    isRequested: boolean;
}

const InstructorsTable: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Local state for pagination and instructor data
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(8); // Set the number of items per page
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInstructors = async () => {
        setLoading(true);
        try {
            const response = await dispatch(getAllInstructorsAction({ page: currentPage, limit })).unwrap();
            setInstructors(response.data); // Adjust based on your API response structure
        } catch (err) {
            setError(err as string);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, [dispatch, currentPage]); // Fetch instructors whenever the page changes

    const handleApprove = async (id: string) => {
        try {
            console.log(id);
            // await dispatch(approveInstructorAction(id)).unwrap();
            fetchInstructors(); // Refresh the list after approval
        } catch (err) {
            setError(err as string);
        }
    };

    const handleReject = async (id: string) => {
        try {
            console.log(id);
            
            // await dispatch(rejectInstructorAction(id)).unwrap();
            fetchInstructors(); // Refresh the list after rejection
        } catch (err) {
            setError(err as string);
        }
    };

    const handleBlock = async (id: string) => {
        try {
            console.log(id);
            // await dispatch(blockInstructorAction(id)).unwrap();
            fetchInstructors(); // Refresh the list after blocking
        } catch (err) {
            setError(err as string);
        }
    };

    const handleUnblock = async (id: string) => {
        try {
            console.log(id);
            // await dispatch(unblockInstructorAction(id)).unwrap();
            fetchInstructors(); // Refresh the list after unblocking
        } catch (err) {
            setError(err as string);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <FallbackUI message="Loading instructors..." />;
    }

    if (error) {
        return <FallbackUI message="Error fetching instructors." />;
    }

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {instructors.map((instructor) => (
                            <tr key={instructor._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{instructor.firstName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{instructor.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={instructor.profile.avatar} alt={instructor.firstName} className="w-10 h-10 rounded-full" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {instructor.isVerified === null && instructor.isRequested && (
                                        <>
                                            <button onClick={() => handleApprove(instructor._id)} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                                            <button onClick={() => handleReject(instructor._id)} className="bg-red-500 text-white px-3 py-1 rounded ml-2">Reject</button>
                                        </>
                                    )}
                                    {instructor.isVerified && !instructor.isBlocked && (
                                        <button onClick={() => handleBlock(instructor._id)} className="bg-yellow-500 text-white px-3 py-1 rounded">Block</button>
                                    )}
                                    {instructor.isVerified && instructor.isBlocked && (
                                        <button onClick={() => handleUnblock(instructor._id)} className="bg-blue-500 text-white px-3 py-1 rounded">Unblock</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                {/* Pagination Controls */}
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 rounded-l">
                    Previous
                </button>
                <span className="px-4 py-2">{currentPage}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} className="px-4 py-2 bg-gray-300 rounded-r">
                    Next
                </button>
            </div>
        </div>
    );
};

export default InstructorsTable;
