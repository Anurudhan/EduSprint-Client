
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { config } from "../../../../common/config";
import { PasswordFormValues } from "../../../../components/common/auth/ChangePasswordModal";

export const updatePassword = createAsyncThunk(
	"/auth/change-password",
	async ( value:PasswordFormValues  , { rejectWithValue }) => {
        try {
			const response = await CLIENT_API.post(
				"/auth/change-password",
				{ value },
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