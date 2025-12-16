/**
 * Bulk Embedding Generation Script
 *
 * This script generates embeddings for all emails that don't have them yet.
 * Run this after initial setup or to catch up on old emails.
 *
 * Usage:
 *   node dist/scripts/generate-embeddings.js
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { KanbanService } from '../kanban/kanban.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EmailItem,
  EmailItemDocument,
} from '../kanban/schemas/email-item.chema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const kanbanService = app.get(KanbanService);

  // Get email model directly
  const EmailModel = app.get<Model<EmailItemDocument>>('EmailItemModel');

  console.log('Starting bulk embedding generation...');

  // Find all emails without embeddings
  const emails = await EmailModel.find({
    $or: [{ hasEmbedding: { $exists: false } }, { hasEmbedding: false }],
  }).limit(100); // Process in batches

  console.log(`Found ${emails.length} emails without embeddings`);

  let success = 0;
  let failed = 0;

  for (const email of emails) {
    try {
      const userId = email.userId.toString();
      await kanbanService.generateAndStoreEmbedding(userId, email.messageId);
      success++;
      console.log(
        `✓ Generated embedding for ${email.messageId} (${success}/${emails.length})`,
      );

      // Rate limit to avoid OpenAI rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      failed++;
      console.error(`✗ Failed for ${email.messageId}:`, error.message);
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${emails.length}`);

  await app.close();
}

bootstrap().catch(console.error);
