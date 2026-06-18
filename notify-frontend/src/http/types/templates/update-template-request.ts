export interface UpdateTemplateRequest {
  templateId: string;
  data: {
    title: string;
    channel: string;
    content: string;
    subject: string;
  };
}
