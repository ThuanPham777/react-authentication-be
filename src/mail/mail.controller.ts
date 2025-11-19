import {
    Controller,
    Get,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class MailController {
    constructor(private readonly mail: MailService) { }

    @Get('mailboxes')
    getMailboxes() {
        return {
            status: 'success',
            data: this.mail.getMailboxes(),
        };
    }

    @Get('mailboxes/:id/emails')
    getMailboxEmails(
        @Param('id') mailboxId: string,
        @Query('page') page = '1',
        @Query('pageSize') pageSize = '20',
    ) {
        const pagination = this.mail.getEmailsByMailbox(mailboxId, Number(page), Number(pageSize));
        return {
            status: 'success',
            ...pagination,
        };
    }

    @Get('emails/:id')
    getEmailDetail(@Param('id') emailId: string) {
        return {
            status: 'success',
            data: this.mail.getEmailById(emailId),
        };
    }
}


