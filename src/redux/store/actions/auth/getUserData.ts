import { createAsyncThunk } from "@reduxjs/toolkit";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";
import { AxiosError } from "axios";

export const getUserData = createAsyncThunk(
    "user/getUserData", async (_ , {rejectWithValue} ) => {

        try {
            const response = await CLIENT_API.get('/auth/getuser',config)
            
            console.log(response,"get users");
            

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