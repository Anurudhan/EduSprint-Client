import { motion } from "framer-motion";
import { Download, CheckCircle } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { EnrollmentEntity, SignupFormData } from "../../../types";
import logo from "../../../assets/Screenshot 2024-09-30 112131_processed.png";

interface EnhancedCertificateProps {
  enrollment: EnrollmentEntity;
  user: SignupFormData|null;
  enrollmentId: string;
  totalCourseScore: number;
  completedDate?: string;
  onClose: () => void;
}

// This component would replace the certificate modal in your existing code
const EnhancedCertificate: React.FC<EnhancedCertificateProps> = ({ 
  enrollment, 
  user, 
  enrollmentId, 
  totalCourseScore, 
  completedDate = new Date().toLocaleDateString(),
  onClose 
}) => {
  const downloadCertificateAsPDF = async (): Promise<void> => {
    const certificateElement = document.getElementById('certificate-content');
    if (!certificateElement) {
      console.error('Certificate element not found');
      return;
    }
    
    try {
      // Show loading indicator
      const downloadButton = document.getElementById('download-certificate-button');
      if (downloadButton) {
        downloadButton.innerHTML = '<span class="animate-pulse">Generating PDF...</span>';
        // Fix TypeScript error by checking if it's an HTMLButtonElement
        if (downloadButton instanceof HTMLButtonElement) {
          downloadButton.disabled = true;
        }
      }
      
      const canvas = await html2canvas(certificateElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: null
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions to fit the PDF properly
      const imgWidth = 297; // A4 width in landscape (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${user?.userName || 'Student'}_${enrollment?.course?.title || 'Course'}_Certificate.pdf`);
      
      // Reset button
      if (downloadButton) {
        downloadButton.innerHTML = '<span class="flex items-center"><svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download Certificate</span>';
        // Fix TypeScript error
        if (downloadButton instanceof HTMLButtonElement) {
          downloadButton.disabled = false;
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your certificate. Please try again.');
      
      // Reset button on error
      const downloadButton = document.getElementById('download-certificate-button');
      if (downloadButton) {
        downloadButton.innerHTML = '<span class="flex items-center"><svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download Certificate</span>';
        // Fix TypeScript error
        if (downloadButton instanceof HTMLButtonElement) {
          downloadButton.disabled = false;
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-4xl w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Certificate content - reduced vertical spacing */}
        <div 
          id="certificate-content" 
          className="border-8 border-double border-indigo-600 dark:border-indigo-400 rounded-lg p-6 bg-white dark:bg-gray-800 relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'repeating-radial-gradient(circle at 40px 40px, #5046e4 0, #5046e4 1px, transparent 0, transparent 20px)', 
              backgroundSize: '40px 40px',
              transform: 'rotate(45deg)',
              zIndex: 0
            }}></div>
          </div>
          
          {/* Certificate header - reduced margins */}
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
              <img 
                          src={logo} // Replace with your logo path
                          alt="EduSprint Logo" 
                          className="w-16 h-16"
                        />
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 text-transparent bg-clip-text">
                    EduSprint
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Learn Smart, Learn Fast
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Certificate ID
                </div>
                <div className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {`ES-${enrollmentId?.slice(-8).toUpperCase() || '00000000'}`}
                </div>
              </div>
            </div>

            {/* Certificate title - reduced margins */}
            <div className="text-center my-4">
              <h1 className="font-serif text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                Certificate of Achievement
              </h1>
              <div className="w-40 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
            </div>

            {/* Certificate body - reduced vertical spacing */}
            <div className="text-center space-y-3 my-6">
              <p className="text-base text-gray-600 dark:text-gray-400">
                This is to certify that
              </p>

              <h2 className="text-2xl font-serif font-bold text-indigo-700 dark:text-indigo-300">
                {user?.userName || 'Student Name'}
              </h2>

              <p className="text-base text-gray-600 dark:text-gray-400">
                has successfully completed the course
              </p>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 max-w-lg mx-auto">
                {enrollment?.course?.title || 'Course Title'}
              </h3>
              
              <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Completed with {totalCourseScore?.toFixed(1) || 0}% score</span>
              </div>
            </div>

            {/* Certificate footer - reduced margins */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="h-0.5 w-36 bg-gray-300 dark:bg-gray-600 mx-auto mb-1"></div>
                <p className="text-gray-600 dark:text-gray-400 font-semibold text-sm">
                  {enrollment?.instructor?.userName || 'Instructor Name'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Instructor</p>
              </div>
              
              <div className="text-center">
                <div className="h-0.5 w-36 bg-gray-300 dark:bg-gray-600 mx-auto mb-1"></div>
                <p className="text-gray-600 dark:text-gray-400 font-semibold text-sm">
                  {completedDate}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Date of Completion</p>
              </div>
            </div>
            
            {/* Verification note - smaller text */}
            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
              <p>This certificate verifies the completion of the EduSprint course requirements.</p>
              <p>To verify the authenticity of this certificate, visit edusprint.com/verify and enter the Certificate ID.</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            id="download-certificate-button"
            onClick={downloadCertificateAsPDF}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            <span>Download Certificate</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedCertificate;