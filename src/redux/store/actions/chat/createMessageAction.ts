import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";
import { MessageEntity } from "../../../../types/IMessageType";


export const createMessageAction = createAsyncThunk(
    "chat/createMessage",
    async (data: MessageEntity,{rejectWithValue}) => {
        try {

            const response = await CLIENT_API.post(
                "/api/chat/message",
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