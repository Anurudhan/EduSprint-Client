
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { config } from "../../../../common/config";
import { SignupFormData } from "../../../../types";


export const updateUser = createAsyncThunk(
	"/user/update-profile",
	async ( data:SignupFormData  , { rejectWithValue }) => {
        try {
			const response = await CLIENT_API.post(
				"/user/update-profile",
				{ data },
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