import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // If no roles are required, allow access
    }

    const { user }: { user: User } = context.switchToHttp().getRequest();

    // Check if the user's role is included in the required roles
    return requiredRoles.includes(user.role);
  }
}
