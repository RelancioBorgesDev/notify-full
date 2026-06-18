import type { Channel } from "./get-notifications-response";

export interface CreateNotificationRequest {
  recipientId: string;
  templateId: string;
  channel: Channel;
  title: string;
  content: string;
  priority: number;
  scheduledAt: string;
}

export interface CreateNotificationResponse {
  message: string;
  notificationId: string;
}
