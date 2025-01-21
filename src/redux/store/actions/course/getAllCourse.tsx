import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";
import { FilterState } from "../../../../types/ICourse";

export const getAllCourse = createAsyncThunk(
    "course/get-all-course",
    async (
        data: {
            page?: number;
            limit?: number;
            filters?: FilterState
        },
        { rejectWithValue }
    ) => {
        try {
            const queryParams = new URLSearchParams();
            

            if (data?.page) queryParams.append("page", data.page.toString());
            if (data?.limit) queryParams.append("limit", data.limit.toString());
            if (data?.filters) {
                queryParams.append("filters", JSON.stringify(data.filters));
            }

            const query = queryParams.toString();
            const response = await CLIENT_API.get(`/course/allcourse${query ? `?${query}` : ""}`, config);

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
