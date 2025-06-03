import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class BubbleGameTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const { headers, user }: Request = context.switchToHttp().getRequest();
    const gameToken = headers['x-game-token'] as string; // Expect the token to be in the headers

    if (!gameToken) {
      throw new UnauthorizedException('Game token is missing');
    }

    // Validate the token using AuthService (implement your validation logic)
    const isValid = this.authService.validateBubbleGameToken(
      user!._id.toString(),
      gameToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid game token');
    }

    return true; // Allow the request if the token is valid
  }
}
