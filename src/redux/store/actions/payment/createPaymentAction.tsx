
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";

export const createPaymentAction = createAsyncThunk(
	"course/createPayment",
	async (
		data: unknown,
		{ rejectWithValue }
	) => {
		try {
			const response = await CLIENT_API.post(
				"/payment/",
				data,
				config
			);
			if (response.data.success) {
				return response.data;
			} else {
				return rejectWithValue(response.data);
			}
		} catch (error: unknown) {
			console.log("Create payment action Error: ", error);
			const e: AxiosError = error as AxiosError;
			return rejectWithValue(e.response?.data || e.message);
		}
	}
);