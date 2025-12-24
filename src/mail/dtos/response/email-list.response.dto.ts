export class EmailListItemResponseDto {
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

  static fromEmailListItem(item: any): EmailListItemResponseDto {
    return {
      id: item.id,
      mailboxId: item.mailboxId,
      senderName: item.senderName,
      senderEmail: item.senderEmail,
      subject: item.subject,
      preview: item.preview,
      timestamp: item.timestamp,
      starred: item.starred,
      unread: item.unread,
      important: item.important,
    };
  }
}

export class EmailListMetaDto {
  pageSize: number;
  nextPageToken?: string;
  hasMore: boolean;
}

export class EmailListResponseDto {
  data: EmailListItemResponseDto[];
  meta: EmailListMetaDto;

  static create(serviceResult: any): EmailListResponseDto {
    return {
      data: serviceResult.data.map((item: any) =>
        EmailListItemResponseDto.fromEmailListItem(item),
      ),
      meta: serviceResult.meta,
    };
  }
}
