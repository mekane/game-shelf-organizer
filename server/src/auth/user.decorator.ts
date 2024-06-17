import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAuthRecord } from '.';

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request['user'] as UserAuthRecord;
  },
);
