export class AttachmentResponseDto {
  id: string;
  fileName: string;
  size: string;
  type: string;

  static fromAttachment(attachment: any): AttachmentResponseDto {
    return {
      id: attachment.id,
      fileName: attachment.fileName,
      size: attachment.size,
      type: attachment.type,
    };
  }
}

export class EmailDetailResponseDto {
  id: string;
  mailboxId: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  preview: string;
  timestamp: string;
  starred: boolean;
  unread: boolean;
  important: boolean;
  to: string[];
  cc?: string[];
  body: string;
  attachments?: AttachmentResponseDto[];
  threadId?: string;

  static fromEmailDetail(email: any): EmailDetailResponseDto {
    return {
      id: email.id,
      mailboxId: email.mailboxId,
      senderName: email.senderName,
      senderEmail: email.senderEmail,
      subject: email.subject,
      preview: email.preview,
      timestamp: email.timestamp,
      starred: email.starred,
      unread: email.unread,
      important: email.important,
      to: email.to,
      cc: email.cc,
      body: email.body,
      attachments: (email.attachments || []).map((att: any) =>
        AttachmentResponseDto.fromAttachment(att),
      ),
      threadId: email.threadId,
    };
  }
}
