import { createAsyncThunk } from "@reduxjs/toolkit";
import { CourseEntity } from "../../../../types/ICourse";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";

export const addCourse = createAsyncThunk(
    "course/addCourse",async (data:CourseEntity,{rejectWithValue}) => {
        try{
            const response = await CLIENT_API.post("/course/",{...data},config);

            if(response.data.success){
                return response.data;
            }
            else{
                return rejectWithValue(response.data)
            }
        }
        catch(error:unknown){
            const e: AxiosError = error as AxiosError;
            return rejectWithValue(e.response?.data || e.message);
        }
    }
)