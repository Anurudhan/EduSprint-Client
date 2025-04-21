import { AxiosError } from "axios";
import { ToastService } from "../../../../components/common/Toast/ToastifyV1";
import { SignupFormData } from "../../../../types";
import { ApiResponse } from "../../../../common/api";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface GetInstructorsParams {
    page?: number;
    limit?: number;
    search?: string;
}

interface InstructorsResponse {
    success: boolean;
    data: SignupFormData[];
    totalCount: number;
    totalPages: number;
    message?: string;
}

/**
 * Fetch all instructors with pagination and search
 */
export const getAllInstructors = createAsyncThunk<InstructorsResponse, GetInstructorsParams>(
    'admin/get-instructors',
    async (params = {}, { rejectWithValue }) => {
        try {
            // Set defaults
            const queryParams = new URLSearchParams();
            
            // Always include page and limit
            queryParams.set("page", String(params.page || 1));
            queryParams.set("limit", String(params.limit || 10));
            
            // Only add search if it exists and isn't empty
            if (params.search && params.search.trim()) {
                queryParams.set("search", params.search.trim());
            }
            
            const response = await CLIENT_API.get(
                `/user/get-all-instructors?${queryParams.toString()}`, 
                config
            );
            
            if (response.data.success) {
                // Ensure we have all required fields in a consistent format
                return {
                    success: true,
                    data: response.data.data || [],
                    totalCount: response.data.totalCount || 0,
                    totalPages: response.data.totalPages || Math.ceil((response.data.totalCount || 0) / (params.limit || 10))
                };
            } else {
                const errorMsg = response.data.message || "Failed to fetch instructors";
                ToastService.error(errorMsg);
                return rejectWithValue({
                    success: false,
                    message: errorMsg,
                    data: [],
                    totalCount: 0,
                    totalPages: 0
                });
            }
        } catch (error: unknown) {
            const err = error as AxiosError;
            const errorData = err.response?.data as ApiResponse<SignupFormData[]>;
            const errorMsg = errorData?.message || err.message || "Unknown error";
            
            ToastService.error(errorMsg);
            
            return rejectWithValue({
                success: false,
                message: errorMsg,
                data: [],
                totalCount: 0,
                totalPages: 0
            });
        }
    }
);