import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateQuestDto {
  @IsString()
  name: string;

  @IsNumber()
  order: number;

  @IsString()
  nameEn: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  descriptionEn: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsNumber()
  tokens: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsBoolean()
  disabled?: boolean;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
}
