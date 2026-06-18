import type { Channel } from "../notifications/get-notifications-response";

export interface Template {
  id: string;
  title: string;
  channel: Channel;
  subject: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
export interface ListTemplatesResponse {
  message: string;
  templates: Template[];
}
