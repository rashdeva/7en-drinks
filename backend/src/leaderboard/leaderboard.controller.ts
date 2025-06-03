import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  // Get the top 25 users by balance
  @Get('top')
  async getTopUsers() {
    return this.leaderboardService.getTopUsersByBalance();
  }

  // Get a user's rank by balance
  @Get('rank')
  async getUserRank(@CurrentUser() user) {
    return this.leaderboardService.getUserRankByBalance(user._id);
  }
}
