import { createAsyncThunk } from "@reduxjs/toolkit";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";
import { AxiosError } from "axios";
import { Category } from "../../../../types/ICategory";

export const editCategory = createAsyncThunk(
    "course/update-category", async (data:Category , {rejectWithValue} ) => {

        try {
            const response = await CLIENT_API.post('/course/update-category',data,config)
            
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