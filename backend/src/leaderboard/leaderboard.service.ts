import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Get the top 25 users sorted by balance and include their rank
  async getTopUsersByBalance(): Promise<any[]> {
    const users = await this.userModel
      .find({}, { balance: 1, username: 1, first_name: 1 }) // Project only required fields
      .sort({ balance: -1 }) // Sort by balance in descending order
      .limit(25) // Limit to top 25
      .exec();

    // Add rank to each user
    return users.map((user, index) => ({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      balance: user.balance,
      rank: index + 1, // Rank is index + 1 (1-based ranking)
    }));
  }

  // Get the user's rank by balance
  async getUserRankByBalance(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new Error('User not found');
    }

    // Get the rank by counting how many users have a higher balance
    const rank = await this.userModel.countDocuments({
      balance: { $gt: user.balance },
    });

    return rank + 1; // Add 1 to make the rank 1-based
  }
}
