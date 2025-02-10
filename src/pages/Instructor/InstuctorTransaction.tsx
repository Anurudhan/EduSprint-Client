import React, { useEffect, useState } from "react";
import {
  Wallet,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux";
import { PaymentEntity } from "../../types/IPayment";
import { getPaymentsByUserId } from "../../redux/store/actions/payment";

function InstructorTransaction() {
  const { data } = useAppSelector((state: RootState) => state.user);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [transactions, setTransactions] = useState<PaymentEntity[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!data?._id) return;
        const response = await dispatch(getPaymentsByUserId(data._id));
        if (response.payload.success) {
          setTransactions(response.payload.data.payments);
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
  }, [dispatch, data]);

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Withdrawal request submitted: $${withdrawalAmount} via ${paymentMethod}`
    );
    setWithdrawalAmount("");
    setIsWithdrawOpen(false);
  };
const transactionLength= transactions?transactions.length:0;
  // Pagination calculations
  const totalPages = Math.ceil(transactionLength / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions
    ? transactions.slice(startIndex, endIndex)
    : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Wallet Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Wallet className="text-white" size={24} />
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                  Instructor Wallet
                </h2>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 sm:mt-6">
              ${data?.profit || "0"}
            </p>
            <p className="text-sm sm:text-base text-blue-100 mt-1 sm:mt-2">
              Available Balance
            </p>
          </div>

          {/* Withdraw Section */}
          <div className="border-t border-gray-100">
            <button
              onClick={() => setIsWithdrawOpen(!isWithdrawOpen)}
              className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">Withdraw Funds</span>
              {isWithdrawOpen ? (
                <ChevronUp className="text-gray-500" size={20} />
              ) : (
                <ChevronDown className="text-gray-500" size={20} />
              )}
            </button>

            {isWithdrawOpen && (
              <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
                <form onSubmit={handleWithdrawal} className="space-y-4">
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Withdrawal Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        id="amount"
                        min="0"
                        max={Number(data?.profit)}
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        className="pl-8 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
                        required
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Maximum withdrawal: ${data?.profit}
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="paymentMethod"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
                      required
                    >
                      <option value="bank">Bank Transfer</option>
                      <option value="paypal">PayPal</option>
                      <option value="wise">Wise</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                  >
                    Request Withdrawal
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Transaction History
            </h3>

            <div className="text-xs sm:text-sm text-gray-500">
              Showing {startIndex + 1}-
              {Math.min(endIndex, transactionLength)} of{" "}
              {transactionLength}
            </div>
          </div>
          {transactionLength === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-gray-50 rounded-xl">
              <Wallet className="text-blue-500 mb-4" size={48} />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                No Transactions Yet
              </h4>
              <p className="text-sm text-gray-500 max-w-xs">
                Your transaction history will appear here once you start earning
                from your courses.
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {currentTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors space-y-2 sm:space-y-0"
                >
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                    <div
                      className={`p-2 rounded-full flex-shrink-0 ${
                        transaction.type === "credit"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowUpRight size={18} />
                      ) : (
                        <ArrowDownRight size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base text-gray-800">
                        {transaction?.course
                          ? `course:${transaction.course.title}`
                          : `Withdrawal to Bank Account`}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>
                            {new Date(
                              transaction.createdAt!
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {(transaction?.status || "").charAt(0).toUpperCase() +
                            (transaction?.status || "").slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-semibold text-sm sm:text-base ${
                      transaction.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}$
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-4 space-y-3 sm:space-y-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>
              <div className="flex items-center space-x-1 sm:space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg text-xs sm:text-sm ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorTransaction;
