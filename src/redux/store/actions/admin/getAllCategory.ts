import { createAsyncThunk } from "@reduxjs/toolkit";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";
import { AxiosError } from "axios";

export const getAllCategory = createAsyncThunk(
    "course/getallcategory", async (data:{ page?: string | number | null; limit?: number  }, {rejectWithValue} ) => {

        try {
            let query = "?";
            if (data?.page !== null) {
                query += `page=${data.page}&`;
            }
            if (data?.limit !== null) {
                query += `limit=${data.limit}`;
            }
            const response = await CLIENT_API.get(`/course/getallcategory?${query}`,config)
            
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