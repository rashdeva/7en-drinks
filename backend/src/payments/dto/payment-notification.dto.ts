import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TinkoffPaymentNotificationDto {
  @IsNotEmpty()
  @IsString()
  TerminalKey: string;

  @IsNotEmpty()
  @IsString()
  OrderId: string;

  @IsNotEmpty()
  @IsNumber()
  Amount: number;

  @IsNotEmpty()
  @IsString()
  Status: string;

  @IsOptional()
  @IsString()
  ErrorCode?: string;

  @IsOptional()
  @IsString()
  Token?: string;

  @IsOptional()
  @IsString()
  Pan?: string;

  @IsOptional()
  @IsString()
  ExpDate?: string;
}
