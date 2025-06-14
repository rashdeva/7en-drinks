import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  userAddress: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
