import { createAsyncThunk } from "@reduxjs/toolkit";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";
import { AxiosError } from "axios";

import { CredentialResponse } from "@react-oauth/google";

export const googleAuthAction = createAsyncThunk(
    "user/googl-auth", async ({ credentials, userType }: { credentials: CredentialResponse; userType: string }, {rejectWithValue} ) => {

        try {
            const payload = { ...credentials, userType };
            console.log("cred reached act",credentials);
            const response = await CLIENT_API.post('/auth/google-auth',payload,config);
            console.log(response?.data?.messsage,"This is our message")
            
            if (response.data.success) {
				return response.data;
			} else {
				return rejectWithValue(response.data);
			}

        } catch (error: unknown) {
			const e: AxiosError = error as AxiosError;
			return rejectWithValue(e.response?.data || e.message);
        }
    }
)