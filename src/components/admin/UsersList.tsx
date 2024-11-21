import { SignupFormData } from "../../types";

const UsersList = ({
    users,
    onNextPage,
    onPreviousPage,
    onEdit,
    currentPage,
}: { 
    users: SignupFormData[],
    onNextPage: () => void,
    onPreviousPage: () => void,
    onEdit:(user: SignupFormData) => void,
    currentPage: number
}) =>{
    

    
     return (
    
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                        <img className="h-10 w-10 rounded-full" src={String(user?.profile?.avatar)} alt="" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {user.userName}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${user.isBlocked 
                                      ?'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      :'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    }`}>
                                    {user.isBlocked ? "Blocked" : "Active"}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <button 
                                        onClick={() => onEdit(user)} 
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                        Edit
                                    </button>
                                </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <div className="flex justify-between items-center mt-4 px-4 py-2">
            <button 
                onClick={onPreviousPage} 
                disabled={currentPage === 1} 
                className={`px-4 py-2 text-sm font-medium ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'} dark:text-blue-400 dark:hover:text-blue-300`}
            >
                Previous
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Page {currentPage}
            </span>
            <button 
                onClick={onNextPage} 
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
                Next
            </button>
        </div>
        
    </div>
)};

export default UsersList;
