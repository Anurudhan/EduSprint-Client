import { createAsyncThunk } from "@reduxjs/toolkit";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { AxiosError } from "axios";
import { config } from "../../../../common/config";


export const reSendOtpAction = createAsyncThunk(
    "user/resendOtp",
    async (email :string, { rejectWithValue }) => {
        try {
    
            const response = await CLIENT_API.post("/auth/resend-otp", { email }, config);
            
            if (response.data.success) {
                return response.data; 
            } else {
                return rejectWithValue(response.data);
            }
        } catch (error: unknown) {
            console.log("OTP verification error", error);
            const e: AxiosError = error as AxiosError;
            return rejectWithValue(e.response?.data || e.message);
        }
    }
);