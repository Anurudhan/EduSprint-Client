
import { Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from './InvoicePDF';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../redux';



export const Invoice = () => {

    const location = useLocation();
  const { data } = location.state || {}; // Extract the data from state
  const {user} = useAppSelector((state:RootState) => state)

  if (!data) {
    return <div>No invoice data available.</div>;
  }
  const value = {...data,userName:user.data?.userName}
  const handleDownload = async () => {
    const blob = await pdf(<InvoicePDF data={value} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${data._id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Course Invoice</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={handleDownload}
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-gray-600"> User Name</p>
          <p className="font-semibold">{user.data?.userName} </p>
        </div>
        <div>
          <p className="text-gray-600">Date</p>
          <p className="font-semibold">
            {format(new Date(data.createdAt), 'MMMM dd, yyyy')}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Status</p>
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {data.status}
          </span>
        </div>
        <div>
          <p className="text-gray-600">Payment Method</p>
          <p className="font-semibold capitalize">{data.method}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Course Details</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">{data.course.title}</h3>
          <p className="text-gray-600 mb-2">{data.course.description}</p>
          <p className="text-sm">
            <span className="text-gray-600">Level:</span>{' '}
            <span className="capitalize">{data.course.level}</span>
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">Total Amount</span>
          <span className="text-2xl font-bold">₹{data.amount}</span>
        </div>
      </div>
    </div>
  );
};