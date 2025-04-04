import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";
import { IMessage } from "../../../../types/IMessageType";


export const createMessageAction = createAsyncThunk(
    "chat/createMessage",
    async (data: IMessage,{rejectWithValue}) => {
        try {

            const response = await CLIENT_API.post(
                "/chat/message",
                data,config
            );

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