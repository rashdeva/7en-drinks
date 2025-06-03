import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

export const InjectJwtSubject = createParamDecorator(
  (context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    return ctx.getRequest().user;
  },
);

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
