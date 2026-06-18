export interface Log {
  id: string;
  notificationId: string;
  attempt: number;
  response: string;
  status: "SUCCESS" | "FAIL";
  errorMessage: string;
  sentAt: string;
  createdAt: string;
}

export interface ListAllLogsResponse {
  message: string;
  logs: Log[];
}
