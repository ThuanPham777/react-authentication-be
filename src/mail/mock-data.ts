export interface Mailbox {
    id: string;
    name: string;
    unread?: number;
}

export interface EmailAttachment {
    id: string;
    fileName: string;
    size: string;
    type: string;
}

export interface EmailListItem {
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
}

export interface EmailDetail extends EmailListItem {
    to: string[];
    cc?: string[];
    body: string;
    attachments?: EmailAttachment[];
}

export const mailboxes: Mailbox[] = [
    { id: 'inbox', name: 'Inbox' },
    { id: 'starred', name: 'Starred' },
    { id: 'sent', name: 'Sent' },
    { id: 'drafts', name: 'Drafts' },
    { id: 'archive', name: 'Archive' },
    { id: 'trash', name: 'Trash' },
    { id: 'product', name: 'Product' },
    { id: 'design', name: 'Design Review' },
];

export const emails: EmailDetail[] = [
    {
        id: 'eml-1000',
        mailboxId: 'inbox',
        senderName: 'Helena Miles',
        senderEmail: 'helena.miles@example.com',
        subject: 'Sprint 28 - Inbox Zero UX decisions',
        preview: 'Following up on the UX punch list for the inbox zero experience...',
        timestamp: '2025-11-18T14:32:00.000Z',
        starred: true,
        unread: true,
        important: true,
        to: ['you@example.com'],
        cc: ['product@example.com'],
        body:
            '<p>Hey team,</p><p>Following up on the UX punch list for the inbox zero experience. Attached is the walk-through recording plus the Figma link with comments resolved.</p><p>Can we get sign-off before the stakeholder demo tomorrow?</p><p>Thanks!<br/>Helena</p>',
        attachments: [
            {
                id: 'att-1',
                fileName: 'inbox-zero-walkthrough.mp4',
                size: '18 MB',
                type: 'video/mp4',
            },
            {
                id: 'att-2',
                fileName: 'ux-decisions.fig',
                size: '4.2 MB',
                type: 'application/octet-stream',
            },
        ],
    },
    {
        id: 'eml-1001',
        mailboxId: 'inbox',
        senderName: 'Stripe',
        senderEmail: 'support@stripe.com',
        subject: 'Action required: Verify new webhook endpoint',
        preview: 'You recently added a new webhook endpoint. Please confirm ownership...',
        timestamp: '2025-11-18T09:15:00.000Z',
        starred: false,
        unread: false,
        important: true,
        to: ['you@example.com'],
        body:
            '<p>Hi there,</p><p>You recently added a new webhook endpoint to your Stripe account. Please confirm ownership within 48 hours to avoid delivery interruptions.</p><p>Thanks,<br/>Stripe</p>',
    },
    {
        id: 'eml-1002',
        mailboxId: 'starred',
        senderName: 'Jason Patel',
        senderEmail: 'jason@acme.io',
        subject: 'Deck feedback + next steps',
        preview: 'Loved the direction overall. A few thoughts on positioning and roadmap...',
        timestamp: '2025-11-17T20:42:00.000Z',
        starred: true,
        unread: false,
        important: false,
        to: ['you@example.com'],
        body:
            '<p>Loved the direction overall. A few thoughts on positioning and roadmap sequencing—see inline comments.</p><p>Let’s regroup tomorrow.</p>',
        attachments: [
            {
                id: 'att-3',
                fileName: 'deck-comments.pdf',
                size: '856 KB',
                type: 'application/pdf',
            },
        ],
    },
    {
        id: 'eml-1003',
        mailboxId: 'sent',
        senderName: 'You',
        senderEmail: 'you@example.com',
        subject: 'Follow-up: Google Sign-In QA findings',
        preview: 'Documented the QA issues we found while testing Google Sign-In on mobile...',
        timestamp: '2025-11-17T15:03:00.000Z',
        starred: false,
        unread: false,
        important: true,
        to: ['qa-team@example.com'],
        cc: ['auth@example.com'],
        body:
            '<p>Hi all,</p><p>Documented the QA issues we found while testing Google Sign-In on mobile. The biggest blocker is the missing refresh token rotation when the network reconnects.</p><p>Let me know if you have questions.</p>',
    },
    {
        id: 'eml-1004',
        mailboxId: 'drafts',
        senderName: 'You',
        senderEmail: 'you@example.com',
        subject: 'Re: Compose modal empty state copy',
        preview: 'Need a better CTA for the compose modal when there are no drafts saved...',
        timestamp: '2025-11-16T11:20:00.000Z',
        starred: false,
        unread: true,
        important: false,
        to: ['copywriter@example.com'],
        body: '<p>Need a better CTA for the compose modal when there are no drafts saved. Current copy feels flat.</p>',
    },
    {
        id: 'eml-1005',
        mailboxId: 'product',
        senderName: 'Analytics Bot',
        senderEmail: 'analytics@system.local',
        subject: 'Daily retention snapshot (Nov 16)',
        preview: 'DAU 12.4k (-1.8%), activation rate 62.3% (+0.6pp)...',
        timestamp: '2025-11-16T07:05:00.000Z',
        starred: false,
        unread: false,
        important: false,
        to: ['product@example.com'],
        body:
            '<p>DAU 12.4k (-1.8%), activation rate 62.3% (+0.6pp), inbox load time P75: 820ms (-40ms).</p><p>See Looker dashboard for full breakdown.</p>',
    },
    {
        id: 'eml-1006',
        mailboxId: 'design',
        senderName: 'Mara Dorsey',
        senderEmail: 'mara@designlab.io',
        subject: 'Design review: keyboard shortcuts overlay',
        preview: 'Captured the latest overlay interactions plus accessibility notes...',
        timestamp: '2025-11-15T18:55:00.000Z',
        starred: true,
        unread: false,
        important: false,
        to: ['you@example.com'],
        body:
            '<p>Captured the latest overlay interactions plus accessibility notes. Make sure focus order matches the spec; VO was skipping labels.</p><p>—Mara</p>',
    },
];


