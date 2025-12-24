export class MailboxResponseDto {
  id: string;
  name: string;
  unread?: number;

  static fromMailbox(mailbox: any): MailboxResponseDto {
    return {
      id: mailbox.id,
      name: mailbox.name,
      unread: mailbox.unread,
    };
  }
}

export class MailboxesResponseDto {
  mailboxes: MailboxResponseDto[];

  static create(mailboxes: any[]): MailboxesResponseDto {
    return {
      mailboxes: mailboxes.map((m) => MailboxResponseDto.fromMailbox(m)),
    };
  }
}
