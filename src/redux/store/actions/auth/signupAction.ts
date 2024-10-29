import { config } from "../../../../common/config"
import { SignupFormData, Response} from "../../../../types";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const signupAction = createAsyncThunk<Response,SignupFormData>(
	"user/signup",
	async (data: SignupFormData, {rejectWithValue }) => {
		try {
			const response = await CLIENT_API.post("/auth/signup", data, config);

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
);