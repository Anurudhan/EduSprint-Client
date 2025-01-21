import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";

export const getEnrollmentByUserIdAction = createAsyncThunk (
    "course/getEnrollmentByUserIdAction", async (userId: string, {rejectWithValue}) => {
        try {
            const response = await CLIENT_API.get(`/course/enrollment/user/${userId}`,config)

			if (response.data.success) {
				return response.data;
			} else {
				return rejectWithValue(response.data);
			}

        } catch (error) {
			console.log("Fetch enrollment action Error: ", error);
			const e: AxiosError = error as AxiosError;
			return rejectWithValue(e.response?.data || e.message); 
        }
    }
)