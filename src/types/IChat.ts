import { Role, SignupFormData } from "./IForm";
import { MessageEntity } from "./IMessageType";

export enum SubscriptionType {
    none = "none",
    basic = "basic",
    standard = "standard",
    premium = "premium"
}

export enum ChatStatus {
    requested = "requested",
    active = "active",
    block = "block"
}

export enum ChatType {
    individual = "individual",
    group = "group"
}

interface BaseChatEntity {
    _id?: string;
    type: ChatType;
    status?: ChatStatus;
    lastSeen?: Date | string;
    lastMessage?: MessageEntity;
    unreadCounts?: number;
    subscriptionType?: SubscriptionType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    participant?:(SignupFormData|string);
}

export interface IndividualChatEntity extends BaseChatEntity {
    type: ChatType.individual;
    participants: (string|SignupFormData)[]; 
}

export interface GroupChatEntity extends BaseChatEntity {
    type: ChatType.group;
    participants: (SignupFormData|string)[]; 
    groupName: string;
    groupDescription?: string | null;
}

// Create a UI-specific type that extends the base types
export interface UIChatEntity extends Omit<ChatEntity, '_id'> {
    chatId: string;
    name: string;
    avatar:string|File;
    role:Role;
    receiverId: string;
    isOnline?: boolean;
    roomId?: string;
    groupName?: string;
    groupDescription?: string | null;
  }

export type ChatEntity = IndividualChatEntity | GroupChatEntity;
