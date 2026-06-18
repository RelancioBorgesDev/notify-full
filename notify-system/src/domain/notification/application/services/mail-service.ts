export interface SendMailInput {
  to: string;
  subject: string;
  text?: string; 
  html?: string; 
}

export abstract class MailService {
  abstract sendMail(data: SendMailInput): Promise<void>;
}
