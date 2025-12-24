import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    // Extract user ID from various possible locations
    const userId = user.sub ?? user.userId ?? user.id ?? user._id;

    // If specific field requested, return that
    if (data) {
      return user[data];
    }

    // Return user object with normalized userId
    return { ...user, userId };
  },
);

export interface CurrentUserData {
  userId: string;
  sub?: string;
  email?: string;
  [key: string]: any;
}
