import { IsString, IsEmail, IsOptional, IsDateString, IsNumber, IsIn, MaxLength, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGuessDto {
  @IsString()
  @MaxLength(100)
  guesserName: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(200)
  guesserEmail?: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  @IsIn(['boy', 'girl', 'surprise'])
  gender: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  middleName?: string;

  @IsNumber()
  @Min(3)
  @Max(15)
  @Transform(({ value }) => parseFloat(value))
  weightPounds: number;

  @IsNumber()
  @Min(12)
  @Max(28)
  @Transform(({ value }) => parseInt(value))
  heightInches: number;

  @IsOptional()
  @IsString()
  birthTime?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  eyeColor?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  hairColor?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  specialMessage?: string;
} 