// shared/types.ts (adding to your existing types file)
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
  
  export interface IChat {
    _id?: string;
    chatType: ChatType;
    status?: ChatStatus;
    subscriptionType?: SubscriptionType;
    participants: string[];
    admins?: string[];
    name?: string | null;
    avatar?: string | null;
    lastMessage?: {
      messageId?: string | null;
      content?: string | null;
      sender?: string | null;
      timestamp?: Date | null;
    } | null;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    unreadCount: Array<{
      userId: string | null;
      count: number;
    }>;
  }