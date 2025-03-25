
export type MessageType = 'error' | 'warning' | 'info' | 'success';


// shared/types.ts
export enum contentType {
  text = "text",
  image = "image",
  video = "video",
  audio = "audio",
  file = "file",
}

export interface IMessage {
  _id?: string;
  chatId: string;
  sender: string;
  content: string;
  contentType: contentType;
  fileUrl?: string;
  replyTo?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  readBy?: Array<{
    userId: string | null;
    readAt: Date;
  }>;
  reactions?: Array<{
    userId: string | null;
    emoji: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}