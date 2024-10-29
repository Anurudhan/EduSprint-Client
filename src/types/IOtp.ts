export interface VerifyOtpResponse {
    success: boolean;
    message?: string; // Add other properties as needed
  }

  export interface VerifyOtpParams{
    otp: string|number;
    email: string;
  }