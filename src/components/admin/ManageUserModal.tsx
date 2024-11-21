import React from 'react';
import { SignupFormData } from '../../types';

interface UserDetailModalProps {
    user: SignupFormData | null;
    onClose: () => void;
    onToggleBlock: () => void;
}

const ManageUserModal: React.FC<UserDetailModalProps> = ({ 
    user, 
    onClose, 
    onToggleBlock 
}) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header with Avatar and Basic Info */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center relative">
                    <img 
                        className="h-24 w-24 rounded-full mx-auto border-4 border-white shadow-lg object-cover" 
                        src={String(user?.profile?.avatar) || '/default-avatar.png'} 
                        alt={`${user.userName}'s avatar`} 
                    />
                    <h2 className="text-xl font-bold text-white mt-4">{user.userName}</h2>
                    <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold 
                        ${user.isBlocked 
                          ? 'bg-red-500 text-white'
                          : 'bg-green-500 text-white'
                        }`}>
                        {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                </div>

                {/* Detailed Information */}
                <div className="p-6 space-y-4">
                    {/* Email */}
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                    </div>

                    {/* Birthday */}
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Birthday</p>
                            <p className="font-medium">
                                {user.profile?.dateOfBirth 
                                    ? new Date(user.profile.dateOfBirth).toLocaleDateString() 
                                    : 'Not provided'}
                            </p>
                        </div>
                    </div>

                    {/* Qualification */}
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5 7.885V10a1 1 0 00.447.894l5 3a1 1 0 001.106 0l5-3A1 1 0 0017 10V7.884l1.394-.595a1 1 0 000-1.84l-7-3z" />
                                <path d="M3 13.692V16a1 1 0 001 1h12a1 1 0 001-1v-2.308A24.454 24.454 0 0110 15c-2.888 0-5.647-.726-7-1.308z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Qualification</p>
                            <p className="font-medium">
                                {user?.qualification || 'Not specified'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-end space-x-3">
                    <button 
                        onClick={onToggleBlock} 
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
                            ${user.isBlocked 
                              ? 'bg-green-500 hover:bg-green-600 text-white' 
                              : 'bg-red-500 hover:bg-red-600 text-white'}`}
                    >
                        {user.isBlocked ? "Activate User" : "Block User"}
                    </button>
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 rounded-md text-sm font-medium 
                            bg-gray-200 dark:bg-gray-600 
                            hover:bg-gray-300 dark:hover:bg-gray-500 
                            text-gray-700 dark:text-gray-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageUserModal;