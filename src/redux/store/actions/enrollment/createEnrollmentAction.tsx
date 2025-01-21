import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";


export const createEnrollmentAction = createAsyncThunk(
    "course/createEnrollment",
    async (data: {
        userId: string;
        courseId: string;
        enrolledAt: number|string;
    },{rejectWithValue}) => {
       
        try {

            const response = await CLIENT_API.post(
                `/course/enrollment/`,
                data,
                config
            );
			if (response.data.success) {
				return response.data;
			} else {
				return rejectWithValue(response.data);
			}

        } catch (error) {
			console.log("Create enrollment action Error: ", error);
			const e: AxiosError = error as AxiosError;
			return rejectWithValue(e.response?.data || e.message);
        }
    }
)