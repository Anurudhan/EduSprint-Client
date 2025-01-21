
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";

export const getPaymentsByUserId = createAsyncThunk (
    "payment/getAllPayment", async (userId:string,{rejectWithValue}) => {
        try {
            const response = await CLIENT_API.get(`/payment/userPayments/${userId}`,config)


			if (response.data.success) {
				return response.data;
			} else {
				return rejectWithValue(response.data);
			}
		} catch (error: unknown) {
			console.log("Get payment session action Error: ", error);
			const e: AxiosError = error as AxiosError;
			return rejectWithValue(e.response?.data || e.message);
		}
    }
)