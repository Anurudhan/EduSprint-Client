import { createAsyncThunk } from "@reduxjs/toolkit";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";
import { AxiosError } from "axios";

export const getAllCategory = createAsyncThunk(
  "course/getallcategory", 
  async (data: { 
    page?: string | number | null; 
    limit?: number;
    search?: string;
  }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (data?.page !== undefined && data.page !== null) {
        queryParams.append('page', data.page.toString());
      }
      
      if (data?.limit !== undefined && data.limit !== null) {
        queryParams.append('limit', data.limit.toString());
      }
      
      if (data?.search) {
        queryParams.append('search', data.search);
      }
      
      const query = queryParams.toString();
      const url = `/course/getallcategory${query ? `?${query}` : ''}`;
      
      const response = await CLIENT_API.get(url, config);
      
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