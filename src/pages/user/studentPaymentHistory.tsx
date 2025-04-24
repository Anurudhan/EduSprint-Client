import React, { useEffect, useState } from "react";
import {
  CreditCard,
  DollarSign,
  Receipt,
  History,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux";
import { getPaymentsByUserId } from "../../redux/store/actions/payment";
import { PaymentEntity } from "../../types/IPayment";
import { FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-300">{label}</p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400";
    case "pending":
      return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
    case "failed":
      return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
  }
};

const StudentPaymentHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const user = useAppSelector((state: RootState) => state.user.data);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [transactions, setTransactions] = useState<PaymentEntity[]>([]);
  const itemsPerPage = 5;
  const [totalPaid, setTotalPaid] = useState("");
  const [lastPayment, setLastPayment] = useState("");
  const [pendingPayments, setPendingPayments] = useState("");
  const [paymentHistory, setPaymentHistory] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user?._id) return;
        const response = await dispatch(getPaymentsByUserId(user._id));
        if (response.payload.success) {
          setTransactions(response.payload.data.payments);
          setTotalPaid(response.payload.data.totalAmount);
          setLastPayment(response.payload.data.lastPayment);
          setPendingPayments(response.payload.data.pendingPaymentCount);
          setPaymentHistory(response.payload.data.totalPayments);
        } else {
          console.error(
            "Failed to fetch transactions:",
            response.payload.message
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch transactions. Please try again later.",
          error
        );
      }
    };
    fetchTransactions();
  }, [dispatch, user]);

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === "date") {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      const amountA = parseFloat(a.amount?.replace("$", "") || "0");
      const amountB = parseFloat(b.amount?.replace("$", "") || "0");
      return sortDirection === "asc" ? amountA - amountB : amountB - amountA;
    }
  });

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field: "date" | "amount") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownload = (transaction: PaymentEntity) => {
    navigate("/student/invoice", { state: { data: transaction } });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Payment Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <StatCard
            icon={DollarSign}
            label="Total Amount Paid"
            value={totalPaid}
          />
          <StatCard
            icon={CreditCard}
            label="Last Payment"
            value={lastPayment}
          />
          <StatCard
            icon={Receipt}
            label="Pending Payments"
            value={pendingPayments}
          />
          <StatCard
            icon={History}
            label="Payment History"
            value={`${paymentHistory} transactions`}
          />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Transaction History
          </h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Course
                  </th>
                  <th
                    className="px-6 py-3 text-left cursor-pointer group"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </span>
                      <ArrowUpDown
                        className={`w-4 h-4 text-gray-400 dark:text-gray-300 ${
                          sortField === "date"
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left cursor-pointer group"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </span>
                      <ArrowUpDown
                        className={`w-4 h-4 text-gray-400 dark:text-gray-300 ${
                          sortField === "amount"
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                {paginatedTransactions.map((transaction, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      {transaction.course?.title || "Unknown Course"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      {transaction.amount || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          transaction.status || ""
                        )}`}
                      >
                        {transaction.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      <button
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        onClick={() => handleDownload(transaction)}
                      >
                        <FaDownload />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, transactions.length)} of{" "}
              {transactions.length} transactions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 dark:bg-blue-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPaymentHistory;