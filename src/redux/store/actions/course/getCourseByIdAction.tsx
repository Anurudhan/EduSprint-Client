import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";

export const getCourseByIdAction = createAsyncThunk(
    "course/getCourseById",async(id:string,{rejectWithValue})=>{
        try{

            const response = await CLIENT_API.get(`/course/getcourse/${id}`,config);
            if(response.data.success){
                return response.data
            }
            return rejectWithValue(response.data)

        }
        catch(error:unknown){
            const e:AxiosError =error as AxiosError;
            return rejectWithValue(e.response?.data||e.message)
        }
    })