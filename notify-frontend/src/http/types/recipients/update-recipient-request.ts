export interface UpdateRecipientRequest {
  recipientId: string;
  data: {
    name?: string;
    email?: string;
    phone?: string;
    pushToken?: string;
    status?: "ACTIVE" | "INACTIVE";
  };
}
