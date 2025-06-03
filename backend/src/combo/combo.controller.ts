// src/combo/combo.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ComboService } from './combo.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Roles } from 'src/auth/auth.decorators';

@UseGuards(JwtAuthGuard)
@Controller('api/combo')
export class ComboController {
  constructor(
    private readonly comboService: ComboService,
    private readonly userService: UsersService, // Inject UserService to fetch user details
  ) {}

  @Post('check')
  async checkCombination(
    @Body() combination: number[],
    @CurrentUser() user: User, // Extract the user from JWT
  ): Promise<{
    success: boolean;
    user: User;
  }> {
    try {
      const isValid = await this.comboService.checkCombination(
        combination,
        user._id,
      );

      // Fetch the updated user after the combo check
      const updatedUser = await this.userService.findOneById(user._id); // Assuming UserService has a method `findById`

      return {
        success: isValid,
        user: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        user: user, // Return current balance on failure
      };
    }
  }

  @Roles('admin')
  @Get('today')
  async getTodayCombination(): Promise<{ combination: number[] }> {
    const combo = await this.comboService.findTodayCombination();
    return { combination: combo?.combination || [] };
  }
}
