import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { config } from "../../../../common/config";
import { CLIENT_API } from "../../../../utilities/axios/instance";

export const getAllStudentsAction = createAsyncThunk(
    'admin/get-instructors',
    async (data: { page?: string | number; limit?: string | number, search?: string }, { rejectWithValue }) => {
        try {
            let query = "?";
            if (data?.page) {
                query += `page=${data.page}&`;
            }
            if (data?.limit) {
                query += `limit=${data.limit}`;
            }
            if(data.search){
                query += `search=${data.search}`
            }

            const response = await CLIENT_API.get(`/user/get-all-students${query}`, config);
            if (response.data.success) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
            
        } catch (error: unknown) {
            console.log("Get students action Error: ", error);
            const e: AxiosError = error as AxiosError;
            return rejectWithValue(e.response?.data || e.message);
        }
    }
);