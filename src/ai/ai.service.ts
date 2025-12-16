// src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as crypto from 'crypto';

@Injectable()
export class AiService {
  private client: OpenAI;
  private model: string;
  private embeddingModel: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.getOrThrow<string>('OPENAI_API_KEY');
    this.client = new OpenAI({ apiKey });
    this.model =
      this.config.get<string>('OPENAI_MODEL_SUMMARY') ?? 'gpt-4o-mini';
    this.embeddingModel =
      this.config.get<string>('OPENAI_EMBEDDING_MODEL') ??
      'text-embedding-3-small';
  }

  stripHtml(html: string) {
    return html
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<\/?[^>]+(>|$)/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  hashText(text: string) {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  async summarizeEmail(input: {
    subject?: string;
    fromEmail?: string;
    fromName?: string;
    bodyHtml?: string;
    bodyText?: string;
  }) {
    const rawText =
      input.bodyText?.trim() ||
      (input.bodyHtml ? this.stripHtml(input.bodyHtml) : '');

    const safeText = rawText.slice(0, 8000);
    const bodyHash = this.hashText(safeText || '');

    if (!safeText) {
      return {
        summary: 'No content to summarize.',
        bodyHash,
        model: this.model,
      };
    }

    const res = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content:
            'Summarize this email for a Kanban productivity app. ' +
            'Return 2-4 concise bullet points and one action suggestion line.',
        },
        {
          role: 'user',
          content: [
            `From: ${input.fromName ?? ''} <${input.fromEmail ?? ''}>`,
            `Subject: ${input.subject ?? ''}`,
            `Body: ${safeText}`,
          ].join('\n'),
        },
      ],
      temperature: 0.2,
    });

    const summary =
      res.choices?.[0]?.message?.content?.trim() || 'Summary unavailable.';

    return { summary, bodyHash, model: this.model };
  }

  /**
   * Generate embeddings for text using OpenAI embedding model
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!text || !text.trim()) {
      throw new Error('Text cannot be empty for embedding generation');
    }

    // Truncate text to avoid token limits (8191 tokens for text-embedding-3-small)
    const truncated = text.slice(0, 8000);

    const response = await this.client.embeddings.create({
      model: this.embeddingModel,
      input: truncated,
    });

    return response.data[0].embedding;
  }

  /**
   * Generate embedding from email content
   */
  async generateEmailEmbedding(input: {
    subject?: string;
    fromEmail?: string;
    fromName?: string;
    snippet?: string;
    summary?: string;
  }): Promise<number[]> {
    // Combine relevant fields for embedding
    const parts = [
      input.subject || '',
      input.fromName || '',
      input.snippet || '',
      input.summary || '',
    ].filter(Boolean);

    const text = parts.join(' ').trim();
    return this.generateEmbedding(text);
  }
}
