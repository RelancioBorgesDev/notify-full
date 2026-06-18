export interface ListAllRecipientsResponse {
  message: string;
  recipients: {
    id: string;
    name: string;
    email: string;
    phone: string;
    pushToken: string;
    status: "ACTIVE" | "INACTIVE";
  }[];
}
