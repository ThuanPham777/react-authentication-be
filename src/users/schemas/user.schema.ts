import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'users',
})
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({
    required: function () {
      return this.provider === 'password';
    },
  })
  password?: string;

  @Prop({ required: false, trim: true })
  name?: string;

  @Prop({ required: false })
  avatarUrl?: string;

  @Prop({
    required: true,
    enum: ['password', 'google'],
    default: 'password',
  })
  provider: 'password' | 'google';

  @Prop({ required: false, unique: true, sparse: true })
  googleId?: string;

  @Prop({ required: false })
  refreshToken?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hide password when JSON stringifying
UserSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    delete ret.password;
    return ret;
  },
});

// Hash on create or when password changed
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
