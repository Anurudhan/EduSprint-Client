import { commonRequest } from "../common/api";
import { config } from "../common/config";
import { ChatType, IChat, IMessage, SignupFormData } from "../types";

const URL = import.meta.env.VITE_REACT_APP_SOCKET_BACKEND_URL

export const chatApi = {
  // Fetch all chats for the current user
  fetchChats: async (userId: string): Promise<IChat[]|null> => {
    const response = await commonRequest<IChat[]|null>('GET', `${URL}/chat/user?userId=${userId}`,undefined,config);
    return response.data;
  },
  // Create a new chat
  createChat: async (participants: string[]): Promise<IChat> => {
    const response = await commonRequest<IChat>('POST', `${URL}/chat/`, { participants, chatType: ChatType.individual},config);
    console.log(response, "this is test response")
    return response.data;
  },
  // Fetch messages for a specific chat
  fetchMessages: async (chatId: string): Promise<IMessage[]> => {
    const response = await commonRequest<IMessage[]>('GET', `${URL}/chat/messages?chatId=${chatId}`,undefined,config);
    return response.data;
  },
  // Send a new message     
  sendMessage: async (message: IMessage): Promise<IMessage> => {
    const response = await commonRequest<IMessage>('POST', `${URL}/chat/message`, message,config);
    return response.data;
  },
  fetchUsers:async(Ids:string):Promise<SignupFormData[]> =>{
    const response = await commonRequest<SignupFormData[]>("GET",`${URL}/chat/users?ids=${Ids}`,undefined,config);
    return response.data||null;
  }
};