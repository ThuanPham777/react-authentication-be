import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QdrantService implements OnModuleInit {
  private readonly logger = new Logger(QdrantService.name);
  private client: any;
  private readonly collectionName = 'email_embeddings';
  private clientReady: Promise<void>;

  constructor(private readonly config: ConfigService) {
    this.clientReady = this.initializeClient();
  }

  private async initializeClient() {
    try {
      const { QdrantClient } = await import('@qdrant/js-client-rest');
      const url =
        this.config.get<string>('QDRANT_URL') || 'http://localhost:6333';
      const apiKey = this.config.get<string>('QDRANT_API_KEY');

      this.client = new QdrantClient({
        url,
        apiKey,
      });
      this.logger.log('Qdrant client initialized');
    } catch (error) {
      this.logger.error('Failed to initialize Qdrant client', error);
    }
  }

  async onModuleInit() {
    await this.clientReady;
    await this.ensureCollection();
  }

  private async ensureCollection() {
    try {
      await this.clientReady;
      if (!this.client) {
        this.logger.warn(
          'Qdrant client not available, skipping collection creation',
        );
        return;
      }
      const collections = await this.client.getCollections();
      const exists = collections.collections.some(
        (c) => c.name === this.collectionName,
      );

      if (!exists) {
        this.logger.log(`Creating collection: ${this.collectionName}`);
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: 1536, // OpenAI text-embedding-3-small dimension
            distance: 'Cosine',
          },
        });
        this.logger.log(`Collection ${this.collectionName} created`);
      }
    } catch (error) {
      this.logger.error('Failed to ensure collection', error);
    }
  }

  async upsertEmbedding(
    messageId: string,
    userId: string,
    embedding: number[],
    metadata: {
      subject?: string;
      senderName?: string;
      senderEmail?: string;
      snippet?: string;
      summary?: string;
      createdAt?: Date;
    },
  ) {
    try {
      await this.clientReady;
      if (!this.client) return false;
      await this.client.upsert(this.collectionName, {
        wait: true,
        points: [
          {
            id: messageId,
            vector: embedding,
            payload: {
              userId,
              messageId,
              ...metadata,
              createdAt:
                metadata.createdAt?.toISOString() || new Date().toISOString(),
            },
          },
        ],
      });
      return true;
    } catch (error) {
      this.logger.error('Failed to upsert embedding', error);
      return false;
    }
  }

  async searchSimilar(
    userId: string,
    queryEmbedding: number[],
    limit = 10,
    scoreThreshold = 0.5,
  ) {
    try {
      await this.clientReady;
      if (!this.client) return [];

      const results = await this.client.search(this.collectionName, {
        vector: queryEmbedding,
        filter: {
          must: [
            {
              key: 'userId',
              match: { value: userId },
            },
          ],
        },
        limit,
        score_threshold: scoreThreshold,
        with_payload: true,
      });

      return results.map((r) => ({
        messageId: r.payload?.messageId as string,
        score: r.score,
        subject: r.payload?.subject as string,
        senderName: r.payload?.senderName as string,
        senderEmail: r.payload?.senderEmail as string,
        snippet: r.payload?.snippet as string,
        summary: r.payload?.summary as string,
        createdAt: r.payload?.createdAt as string,
      }));
    } catch (error) {
      this.logger.error('Failed to search similar', error);
      return [];
    }
  }

  async deleteEmbedding(messageId: string) {
    try {
      await this.clientReady;
      if (!this.client) return false;

      await this.client.delete(this.collectionName, {
        wait: true,
        points: [messageId],
      });
      return true;
    } catch (error) {
      this.logger.error('Failed to delete embedding', error);
      return false;
    }
  }

  async getUniqueContacts(userId: string, limit = 100) {
    try {
      await this.clientReady;
      if (!this.client) return [];

      const results = await this.client.scroll(this.collectionName, {
        filter: {
          must: [
            {
              key: 'userId',
              match: { value: userId },
            },
          ],
        },
        limit,
        with_payload: true,
      });

      const contacts = new Map<string, { name: string; email: string }>();

      results.points.forEach((point) => {
        const email = point.payload?.senderEmail as string;
        const name = point.payload?.senderName as string;
        if (email && !contacts.has(email)) {
          contacts.set(email, { name: name || email, email });
        }
      });

      return Array.from(contacts.values());
    } catch (error) {
      this.logger.error('Failed to get unique contacts', error);
      return [];
    }
  }
}
