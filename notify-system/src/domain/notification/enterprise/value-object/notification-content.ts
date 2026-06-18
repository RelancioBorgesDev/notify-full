export class NotificationContent {
  private readonly content: string;

  private constructor(content: string) {
    if (content.length > 1024) {
      throw new Error('Content too long');
    }
    this.content = content;
  }

  static create(content: string): NotificationContent {
    return new NotificationContent(content);
  }

  get value(): string {
    return this.content;
  }
}
