import { Injectable, NotFoundException } from '@nestjs/common';
import { emails, mailboxes, EmailDetail } from './mock-data';

@Injectable()
export class MailService {
    getMailboxes() {
        return mailboxes.map((box) => {
            const unread = emails.filter((email) => email.mailboxId === box.id && email.unread).length;
            return { ...box, unread };
        });
    }

    getEmailsByMailbox(mailboxId: string, page = 1, pageSize = 20) {
        const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
        const normalizedPageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.min(pageSize, 50) : 20;
        const filtered = emails
            .filter((email) => email.mailboxId === mailboxId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const start = (normalizedPage - 1) * normalizedPageSize;
        const data = filtered.slice(start, start + normalizedPageSize).map(({ body, attachments, ...rest }) => rest);

        return {
            data,
            meta: {
                total: filtered.length,
                page: normalizedPage,
                pageSize: normalizedPageSize,
            },
        };
    }

    getEmailById(emailId: string): EmailDetail {
        const email = emails.find((item) => item.id === emailId);
        if (!email) throw new NotFoundException('Email not found');
        return email;
    }
}


