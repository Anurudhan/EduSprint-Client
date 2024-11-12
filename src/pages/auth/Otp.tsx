import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppDispatch, RootState } from '../../redux';
import { verifyOtpAction, reSendOtpAction } from '../../redux/store/actions/auth';

const OtpPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.data);

  const email = userData?.email as string || localStorage.getItem('userEmail') as string;
  const role = userData?.role as string || localStorage.getItem('userRole') as string;

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(() => {
    const otpStartTime = localStorage.getItem('otpStartTime');
    const otpDuration = 30; // Duration in seconds
    
    if (otpStartTime) {
      const elapsed = Math.floor((Date.now() - parseInt(otpStartTime)) / 1000);
      const remainingTime = otpDuration - elapsed;
      // If time has expired, return 0
      if (remainingTime <= 0) {
        return 0;
      }
      return remainingTime;
    }
    // First time loading - set start time and return full duration
    localStorage.setItem('otpStartTime', Date.now().toString());
    return otpDuration;
  }); 
  
  const [otpError, setOtpError] = useState('');
  const [hasShownExpiry, setHasShownExpiry] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }
    localStorage.setItem('userEmail', email);
  }, [email, navigate]);

  useEffect(() => {
    // Show expiry message when timer hits 0
    if (timer === 0) {
      if (!hasShownExpiry) {
        toast.info('Time expired! Please click "Resend OTP" to get a new code.', { position: 'top-center' });
        setHasShownExpiry(true);
      }
      return;
    }

    // Start countdown timer
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        const newValue = prevTimer - 1;
        if (newValue <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, hasShownExpiry]);

  const handleResendOtp = async () => {
    try {
      const result = await dispatch(reSendOtpAction(email));
      if (result?.payload?.success) {
        toast.success('OTP resent successfully.', { position: 'top-center' });
        setOtp(['', '', '', '']);
        localStorage.setItem('otpStartTime', Date.now().toString());
        setTimer(30);
        setHasShownExpiry(false);
      } else {
        setOtpError('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      setOtpError('An error occurred while resending the OTP. Please try again.');
      console.error('Error during OTP resend:', error);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }

    setOtp(newOtp);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (timer === 0) {
      toast.error('OTP has expired. Please request a new one.', { position: 'top-center' });
      return;
    }

    try {
      const result = await dispatch(verifyOtpAction({ otp: otpValue, email }));
      if (result?.payload?.success) {
        navigate(`/login/?role=${role}`,{replace:true});
      } else {
        const errorMessage = result.payload?.message || 'Unknown error occurred.';
        setOtpError(errorMessage);
        toast.error(errorMessage, { position: 'top-center' });
      }
    } catch (error) {
      setOtpError('An error occurred while verifying the OTP. Please try again.');
      console.error('Error during OTP verification:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-black dark:to-gray-800">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Enter OTP</h2>
      <div className="flex space-x-2 mb-4">
        {otp.map((value, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={value}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        ))}
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleVerifyOtp}
          disabled={otp.some((digit) => digit === '') || timer === 0}
          className={`px-4 py-2 rounded-md transition duration-200 ${
            otp.some((digit) => digit === '') || timer === 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-500'
          } text-white dark:bg-blue-700 dark:hover:bg-blue-600`}
        >
          Verify OTP
        </button>
        <button
          onClick={handleResendOtp}
          disabled={timer > 0}
          className={`px-4 py-2 rounded-md transition duration-200 ${
            timer > 0 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-500'
          } text-white dark:bg-green-700 dark:hover:bg-green-600`}
        >
          Resend OTP
        </button>
      </div>
      {otpError && <p className="mt-4 text-red-500">{otpError}</p>}
      <p className="mt-2 text-gray-700 dark:text-gray-300">Time left: {timer} seconds</p>
    </div>
  );
};

export default OtpPage;