import { createAsyncThunk } from "@reduxjs/toolkit";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";
import { AxiosError } from "axios";

export const resetPassword = createAsyncThunk(
	"user/updatePassword",
	async (data:{token: string, password: string}, { rejectWithValue }) => {
		try {
			const response = await CLIENT_API.post(
				"/auth/update-password",
				data,
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