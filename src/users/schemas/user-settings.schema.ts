import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface KanbanColumnConfig {
  id: string;
  name: string;
  gmailLabel?: string;
  order: number;
}

@Schema({ timestamps: true })
export class UserSettings extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({
    type: [
      {
        id: String,
        name: String,
        gmailLabel: String,
        order: Number,
      },
    ],
    default: [{ id: 'INBOX', name: 'Inbox', gmailLabel: 'INBOX', order: 0 }],
  })
  kanbanColumns: KanbanColumnConfig[];
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
