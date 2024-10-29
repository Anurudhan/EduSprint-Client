
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";


export const getAllInstructorsAction = createAsyncThunk(
    'admin/get-instructors',
    async (data: { page?: string | number | null; limit?: string | number | null }, { rejectWithValue }) => {
        try {
            let query = "?";
            if (data?.page) {
                query += `page=${data.page}&`;
            }
            if (data?.limit) {
                query += `limit=${data.limit}`;
            }

            const response = await CLIENT_API.get(`/user/get-all-instructors${query}`, config);
            if (response.data.success) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (error: unknown) {
            console.log("Get instructors action Error: ", error);
            const e: AxiosError = error as AxiosError;
            return rejectWithValue(e.response?.data || e.message);
        }
    }
);