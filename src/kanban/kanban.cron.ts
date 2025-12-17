import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { KanbanService } from './kanban.service';

@Injectable()
export class KanbanCron {
  constructor(private readonly kanban: KanbanService) {}

  // chạy mỗi 5 phút để wake snoozed emails (reduced frequency to save memory)
  @Cron('*/5 * * * *')
  async wake() {
    try {
      const result = await this.kanban.wakeExpiredSnoozed();
      if (result.woke > 0) {
        console.log(`[Cron] Woke ${result.woke} snoozed emails`);
      }
    } catch (err) {
      console.error('[Cron] Failed to wake snoozed emails:', err);
    }
  }
}
