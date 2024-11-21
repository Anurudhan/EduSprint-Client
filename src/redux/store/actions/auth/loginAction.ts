import { createAsyncThunk } from "@reduxjs/toolkit"
import { LoginFormData } from "../../../../types"
import { AxiosError } from "axios"
import { CLIENT_API } from "../../../../utilities/axios/instance"
import { config } from "../../../../common/config"



export const loginAction = createAsyncThunk(
    "user/login",
   async(data:LoginFormData,{rejectWithValue })  =>{
    try{
        const response = await CLIENT_API.post("/auth/login",data,config);
        if(response.data.success){
            return response.data;
        }
        else{
            return rejectWithValue(response.data);
        }
    }
    catch(error:unknown){
        const e: AxiosError = error as AxiosError;
        return rejectWithValue(e.response?.data||e.message)
    }
});