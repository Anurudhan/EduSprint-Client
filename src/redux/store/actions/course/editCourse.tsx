import { createAsyncThunk } from "@reduxjs/toolkit";
import { CourseEntity } from "../../../../types/ICourse";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";

export const editCourse = createAsyncThunk(
    "course/edit",async(data:{data:CourseEntity,studentId:string|null,incrementStudentsEnrolled?:boolean},{rejectWithValue})=>{
        try {
            const response = await CLIENT_API.post("/course/updatecourse",data,config);
            if(response.data.success){
                return response.data;
            }
            rejectWithValue(response.data)
            
        } catch (error:unknown) {
            const e:AxiosError = error as AxiosError
            rejectWithValue(e.response?.data||e.message)
        }
    }
)