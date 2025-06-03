import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  InitData,
  createWebAppSecret,
  decodeInitData,
  verifyTelegramWebAppInitData,
} from './auth.utils';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly bubbleTokens = new Map<string, string>();

  validateMiniAppInitData(raw: string): InitData {
    const token = this.configService.get<string>('BOT_TOKEN');
    const initData = decodeInitData(raw);
    const secretKey = createWebAppSecret(token);

    if (
      process.env.ENV === 'production' &&
      !verifyTelegramWebAppInitData(initData, secretKey)
    ) {
      throw new Error('Invalid init data');
    }

    return initData;
  }

  createAccessToken(id: string, _id: string): string {
    const payload = {
      _id: _id,
      sub: id,
    };

    return this.jwtService.sign(payload);
  }

  // Method to create a unique token for the Bubble game session
  createBubbleGameToken(userId: string): string {
    const token = randomBytes(16).toString('hex'); // Generate a random 16-byte token
    this.bubbleTokens.set(userId, token); // Store the token associated with the userId
    return token;
  }

  // Method to validate the Bubble game token
  validateBubbleGameToken(userId: string, token: string): boolean {
    const storedToken = this.bubbleTokens.get(userId); // Retrieve the stored token for the user
    if (!storedToken) {
      return false; // No token found for the user
    }

    // Validate if the provided token matches the stored token
    return storedToken === token;
  }
}
