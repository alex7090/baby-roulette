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
  @IsIn(['boy', 'girl'])
  gender: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  firstNameBoy?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  middleName1Boy?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  middleName2Boy?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  middleName3Boy?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  middleName4Boy?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  firstNameGirl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  middleName1Girl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  middleName2Girl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  middleName3Girl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  middleName4Girl?: string;

  @IsNumber()
  @Min(1.5)
  @Max(7)
  @Transform(({ value }) => parseFloat(value))
  weightKg: number;

  @IsNumber()
  @Min(30)
  @Max(70)
  @Transform(({ value }) => parseInt(value))
  heightCm: number;

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