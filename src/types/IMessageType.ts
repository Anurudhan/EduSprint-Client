

export type MessageType = 'error' | 'warning' | 'info' | 'success';

export enum contentType{
    text="text",
    image="image",
    video="video",
    audio="audio",
    application="application"
}

export interface MessageEntity {
    _id?: string ;
    roomId:string;
    chatId:  string;
    senderId: string;
    content: string;
    contentType: contentType;
    receiverSeen?: boolean;
    isDeleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}