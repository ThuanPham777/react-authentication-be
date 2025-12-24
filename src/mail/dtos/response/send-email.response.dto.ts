export class SendEmailResponseDto {
  messageId: string;

  static create(messageId: string): SendEmailResponseDto {
    return { messageId };
  }
}
