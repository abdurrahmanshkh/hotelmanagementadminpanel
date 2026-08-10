export type NotificationType =
  | 'BOOKING_CONFIRMED'
  | 'CHECK_IN_REMINDER'
  | 'PASSCODE_ACTIVATED'
  | 'SERVICE_UPDATED'
  | 'CHAT_MESSAGE'
  | 'SYSTEM_ANNOUNCEMENT';

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  linkUrl?: string;
  createdAt: string;
}
