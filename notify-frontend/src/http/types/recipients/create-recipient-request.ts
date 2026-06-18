export interface CreateRecipientRequest {
  name: string;
  email: string;
  phone: string;
  pushToken: string;
  status: "ACTIVE" | "INACTIVE" ;
}
