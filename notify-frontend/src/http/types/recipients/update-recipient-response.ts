export interface UpdateRecipientResponse {
  message: string;
  recipient: {
    id: string;
    name: string;
    email: string;
    phone: string;
    pushToken: string;
    status: "ACTIVE" | "INACTIVE";
  };
}
