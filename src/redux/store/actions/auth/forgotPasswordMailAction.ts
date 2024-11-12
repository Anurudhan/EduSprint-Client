
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { config } from "../../../../common/config";

export const forgotPasswordMailAction = createAsyncThunk(
	"user/forgotPasswordMail",
	async ( email: string , { rejectWithValue }) => {
        try {
			const response = await CLIENT_API.post(
				"/auth/forgot-password-mail",
				{ email },
				config
			);


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