      // import { useState, useEffect } from 'react';
      // import { useDispatch, useSelector } from 'react-redux';
      // import { useNavigate } from 'react-router-dom';

      // import { AppDispatch, RootState } from '../../redux';
      // import { verifyOtpAction, reSendOtpAction } from '../../redux/store/actions/auth'; 

      // const OtpPage = () => {
      //   const dispatch = useDispatch<AppDispatch>();
      //   const navigate = useNavigate();
      //   const userData = useSelector((state: RootState) => state.user.data);
        
      //   const email = userData?.email as string;
      //   const role = userData?.role as string
      //   console.log(userData,"this is our user");

      //   const [otp, setOtp] = useState(['', '', '', '']);
      //   const [timer, setTimer] = useState(60);
      //   const [otpError, setOtpError] = useState('');

      //   useEffect(() => {
      //     const startTime = parseInt(localStorage.getItem('otpStartTime') || '0', 10);
      //     const currentTime = Math.floor(Date.now() / 1000);
          
      //     if (startTime) {
      //       const elapsed = currentTime - startTime;
      //       if (elapsed < 60) {
      //         setTimer(60 - elapsed);
      //       } else {
      //         handleResendOtp(); // Resend OTP if the timer has already expired
      //       }
      //     } else {
      //       localStorage.setItem('otpStartTime', currentTime.toString());
      //     }
      //   },);

      //   useEffect(() => {
      //     if (timer === 0) {
      //       setOtpError('Your OTP verification has failed. Please try again.');
      //     } else {
      //       const intervalId = setInterval(() => {
      //         setTimer((prevTimer) => prevTimer - 1);
      //       }, 1000);
        
      //       return () => clearInterval(intervalId);
      //     }
      //   }, [timer]);
          

      //   const handleChange = (value: string, index: number) => {
      //     const newOtp = [...otp];
      //     newOtp[index] = value;

      //     // Move to the next input
      //     if (value && index < otp.length - 1) {
      //       document.getElementById(`otp-input-${index + 1}`)?.focus();
      //     }

      //     setOtp(newOtp);
      //   };
      //   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      //     if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      //       // Move to the previous input if backspace is pressed and the current input is empty
      //       document.getElementById(`otp-input-${index - 1}`)?.focus();
            
      //       // Clear the previous input
      //       const newOtp = [...otp];
      //       newOtp[index - 1] = '';
      //       setOtp(newOtp);
      //     }
      //   };

      //   const handleVerifyOtp = async () => {
      //     const otpValue = otp.join('');
      //     try {
      //       const result = await dispatch(verifyOtpAction({ otp: otpValue, email }));
      //       console.log(result,"otp verification in result");
            
      //       if (result?.payload?.success) {
      //           navigate(`/login/?role=${role}`);
      //       } else {
      //         const errorMessage = result.payload?.message || 'Unknown error occurred.';
      //         setOtpError(errorMessage);
      //         console.error('OTP verification failed:', errorMessage);
      //       }
      //     } catch (error) {
            
      //       setOtpError('An error occurred while verifying the OTP. Please try again.');
      //       console.error('Error during OTP verification:', error);
      //     }
      //   };

      //   const handleResendOtp = async () => {
      //     try {
      //       const result = await dispatch(reSendOtpAction(email)); // Dispatch the resend OTP action

      //       if (result?.payload?.success) {
      //         setOtpError('OTP resend successfully.');
      //         setOtp(['', '', '', '']); // Clear OTP fields
      //         setTimer(60); // Reset the timer
      //       } else {
      //         setOtpError('Failed to resend OTP. Please try again.');
      //       }
      //     } catch (error) {
      //       setOtpError('An error occurred while resending the OTP. Please try again.');
      //       console.error('Error during OTP verification:', error);
      //     }
      //   };

      //   return (
      //     <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-black dark:to-gray-800">
      //       <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Enter OTP</h2>
      //       <div className="flex space-x-2 mb-4">
      //         {otp.map((value, index) => (
      //           <input
      //             key={index}
      //             id={`otp-input-${index}`}
      //             type="text"
      //             value={value}
      //             onChange={(e) => handleChange(e.target.value, index)}
      //             onKeyDown={(e) => handleKeyDown(e, index)}
      //             maxLength={1}
      //             className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
      //           />
      //         ))}
      //       </div>
      //       <button
      //         onClick={handleVerifyOtp}
      //         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-200 dark:bg-blue-700 dark:hover:bg-blue-600"
      //       >
      //         Verify OTP
      //       </button>
      //       {otpError && <p className="mt-4 text-red-500">{otpError}</p>}
      //       <p className="mt-2 text-gray-700 dark:text-gray-300">Time left: {timer} seconds</p>

      //       {/* Resend OTP button */}
      //       <button
      //         onClick={handleResendOtp}
      //         className={'mt-4 px-4 py-2 rounded-md transition duration-200 bg-green-600 text-white hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600'}
      //       >
      //         Resend OTP
      //       </button>
      //     </div>
      //   );
      // };

      // export default OtpPage;

      
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AppDispatch, RootState } from '../../redux';
import { verifyOtpAction, reSendOtpAction } from '../../redux/store/actions/auth'; 

const OTP_DURATION = 60; // seconds

const OtpPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.data);
  
  const email = userData?.email as string;
  const role = userData?.role as string;

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(OTP_DURATION);
  const [otpError, setOtpError] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and handle timer
  const startTimer = useCallback(() => {
    // Clear existing timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Set initial time
    const startTime = Date.now();
    localStorage.setItem('otpStartTime', startTime.toString());
    setTimer(OTP_DURATION);

    // Start new timer
    timerRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      const remainingTime = Math.max(0, OTP_DURATION - elapsedSeconds);

      setTimer(remainingTime);

      if (remainingTime === 0 && timerRef.current) {
        clearInterval(timerRef.current);
        setOtpError('OTP has expired. Please request a new one.');
      }
    }, 1000);
  }, []);

  // Handle OTP resend
  const handleResendOtp = useCallback(async () => {
    try {
      setOtpError(''); // Clear previous errors
      const result = await dispatch(reSendOtpAction(email));

      if (result?.payload?.success) {
        setOtp(['', '', '', '']);
        startTimer(); // Restart timer
        setOtpError('New OTP sent successfully.');
      } else {
        setOtpError('Failed to send new OTP. Please try again.');
      }
    } catch (error) {
      setOtpError('Failed to send OTP. Please try again.');
      console.error('Error sending OTP:', error);
    }
  }, [dispatch, email, startTimer]);

  // Initialize timer on component mount
  useEffect(() => {
    const savedStartTime = localStorage.getItem('otpStartTime');
    
    if (savedStartTime) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
      const remainingTime = Math.max(0, OTP_DURATION - elapsedSeconds);

      if (remainingTime > 0) {
        setTimer(remainingTime);
        startTimer();
      } else {
        setTimer(0);
        setOtpError('OTP has expired. Please request a new one.');
      }
    } else {
      startTimer();
    }

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTimer]);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (timer === 0) {
        setOtpError('OTP has expired. Please request a new one.');
        return;
      }

      const otpValue = otp.join('');
      if (otpValue.length !== 4) {
        setOtpError('Please enter all 4 digits of the OTP.');
        return;
      }

      const result = await dispatch(verifyOtpAction({ otp: otpValue, email }));
      
      if (result?.payload?.success) {
        // Clear timer and storage before navigation
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        localStorage.removeItem('otpStartTime');
        navigate(`/login/?role=${role}`);
      } else {
        setOtpError(result.payload?.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setOtpError('Failed to verify OTP. Please try again.');
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-black dark:to-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Enter OTP</h2>
      <div className="flex space-x-2 mb-4">
        {otp.map((value, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        ))}
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleVerifyOtp}
          disabled={timer === 0}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md transition duration-200 
            ${timer > 0 
              ? 'hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600' 
              : 'opacity-50 cursor-not-allowed'}`}
        >
          Verify OTP
        </button>
        
        <div className="text-center">
          {timer > 0 ? (
            <p className="text-gray-700 dark:text-gray-300">Time remaining: {timer}s</p>
          ) : (
            <p className="text-red-500">OTP expired</p>
          )}
        </div>

        {otpError && <p className="text-red-500 text-center">{otpError}</p>}

        <button
          onClick={handleResendOtp}
          disabled={timer > 0}
          className={`mt-2 px-4 py-2 rounded-md transition duration-200 
            ${timer === 0 
              ? 'bg-green-600 hover:bg-green-500 text-white dark:bg-green-700 dark:hover:bg-green-600' 
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
        >
          Resend OTP {timer > 0 && `(${timer}s)`}
        </button>
      </div>
    </div>
  );
};

export default OtpPage;
