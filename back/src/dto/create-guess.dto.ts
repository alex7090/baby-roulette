import { IsString, IsEmail, IsOptional, IsDateString, IsNumber, IsIn, MaxLength, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGuessDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  guesserName: string;

  @IsOptional()
  @IsEmail({}, { message: 'L\'email doit avoir un format valide' })
  @MaxLength(200, { message: 'L\'email ne peut pas dépasser 200 caractères' })
  @Transform(({ value }) => value === '' ? undefined : value)
  guesserEmail?: string;

  @IsDateString({}, { message: 'La date de naissance doit être une date valide' })
  birthDate: string;

  @IsString({ message: 'Le genre doit être une chaîne de caractères' })
  @IsIn(['boy', 'girl'], { message: 'Le genre doit être "boy" ou "girl"' })
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

  @IsNumber({}, { message: 'Le poids doit être un nombre' })
  @Min(1500, { message: 'Le poids doit être au minimum 1500 grammes' })
  @Max(7000, { message: 'Le poids doit être au maximum 7000 grammes' })
  @Transform(({ value }) => parseInt(value))
  weightGrams: number;

  @IsNumber({}, { message: 'La taille doit être un nombre' })
  @Min(30, { message: 'La taille doit être au minimum 30 cm' })
  @Max(70, { message: 'La taille doit être au maximum 70 cm' })
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