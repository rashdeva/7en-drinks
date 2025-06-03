import { Controller, UseGuards, Get, Param, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile/:profileId')
  async getUserById(@Param('profileId') profileId: string) {
    return this.usersService.findOneById(profileId);
  }

  @Patch('onboarding/complete')
  async completeOnboarding(@CurrentUser() user: User) {
    return this.usersService.completeOnboarding(user._id);
  }
}
