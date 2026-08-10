export type ChatMode = 'BOT' | 'ADMIN';

export type ChatStatus =
  | 'OPEN'
  | 'WAITING_FOR_ADMIN'
  | 'ASSIGNED'
  | 'RESOLVED'
  | 'CLOSED';

export type MessageSenderType = 'CUSTOMER' | 'BOT' | 'ADMIN' | 'SYSTEM';

export interface ChatMessage {
  id: number;
  threadId: number;
  senderType: MessageSenderType;
  senderName: string;
  messageText: string;
  createdAt: string;
  suggestedActions?: { label: string; actionValue: string }[];
}

export interface ChatThread {
  id: number;
  threadReference: string;
  userId: number;
  guestName: string;
  bookingId?: number;
  roomNumber?: string;
  mode: ChatMode;
  status: ChatStatus;
  lastMessageText: string;
  lastMessageAt: string;
  unreadCountCustomer: number;
  unreadCountAdmin: number;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  threadId: number;
  messageText: string;
}
