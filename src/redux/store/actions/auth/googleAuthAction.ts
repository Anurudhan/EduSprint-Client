import { createAsyncThunk } from "@reduxjs/toolkit";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";
import { AxiosError } from "axios";

import { CredentialResponse } from "@react-oauth/google";

export const googleAuthAction = createAsyncThunk(
    "user/googl-auth", async (credentials:CredentialResponse , {rejectWithValue} ) => {

        try {
            console.log("cred reached act",credentials);
            const response = await CLIENT_API.post('/auth/google-auth',credentials,config)
            
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