import { createAsyncThunk } from "@reduxjs/toolkit";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { AxiosError } from "axios";
import { config } from "../../../../common/config";
import { VerifyOtpParams} from "../../../../types";


export const verifyOtpAction = createAsyncThunk(
    "user/verifyOtp",
    async ({ otp, email}:VerifyOtpParams, { rejectWithValue }) => {
        try {
            const response = await CLIENT_API.post("/auth/verify-otp", { otp, email}, config);
            
            if (response.data.success) {
                return response.data; // This will be of type VerifyOtpResponse
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