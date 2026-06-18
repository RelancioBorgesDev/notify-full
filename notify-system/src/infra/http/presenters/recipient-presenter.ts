import { Recipient } from '@/domain/recipients/enterprise/entities/recipient';

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      phone: recipient.phone,
      pushToken: recipient.pushToken,
      status: recipient.status,
      createdAt: recipient.createdAt,
    };
  }
}
