export type MessageType = 'error' | 'warning' | 'info' | 'success';

export interface MessageEntity {
    _id?: string ;
    roomId:string;
    chatId:  string;
    senderId: string;
    content: string;
    contentType: 'text' | 'image' | 'video' | 'audio' | 'application';
    receiverSeen?: boolean;
    isDeleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}