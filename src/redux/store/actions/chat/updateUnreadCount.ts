
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";

interface unreadCount{
    _id:string,
    unreadCount:number
}

export const updateUnreadCount = createAsyncThunk (
    "chat/updateUnreadCount" , async (data:unreadCount ,{rejectWithValue}) => {
        try {
            const response = await CLIENT_API.patch('/api/chat/unread-count',data,config)

			if (response.data.success) {
				return response.data;
			} else {
				return rejectWithValue(response.data);
			}
		} catch (error) {
			console.log("Fetch enrollment action Error: ", error);
			const e: AxiosError = error as AxiosError;
			return rejectWithValue(e.response?.data || e.message);
		}
    }
)