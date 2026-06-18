export type Channel = "EMAIL" | "SMS" | "PUSH";

export type NotificationStatus = "PENDING" | "SENT" | "FAILED" | "READ";

export interface Notification {
  recipientId: string;
  templateId: string;
  channel: Channel;
  title: string;
  content: string;
  status: NotificationStatus;
  priority: number;
  retries: number;
  error?: string;
  scheduledAt?: string | null;
  createdAt: string;
  recipientData: { email: string };
}

export type GetNotificatonsResponse = {
  notifications: Notification[];
};
