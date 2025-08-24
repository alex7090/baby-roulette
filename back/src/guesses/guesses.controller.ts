import { Controller, Get, Post, Body, Query, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { GuessesService } from './guesses.service';
import { CreateGuessDto } from '../dto/create-guess.dto';

@Controller('api/guesses')
export class GuessesController {
  constructor(private readonly guessesService: GuessesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createGuessDto: CreateGuessDto) {
    const guess = await this.guessesService.create(createGuessDto);
    return {
      message: 'Guess submitted successfully!',
      id: guess.id,
      submittedAt: guess.submittedAt,
    };
  }

  @Get()
  async findAll() {
    const guesses = await this.guessesService.findAll();
    return {
      count: guesses.length,
      guesses: guesses.map(guess => ({
        id: guess.id,
        guesserName: guess.guesserName,
        birthDate: guess.birthDate,
        gender: guess.gender,
        firstNameBoy: guess.firstNameBoy,
        middleName1Boy: guess.middleName1Boy,
        middleName2Boy: guess.middleName2Boy,
        middleName3Boy: guess.middleName3Boy,
        middleName4Boy: guess.middleName4Boy,
        firstNameGirl: guess.firstNameGirl,
        middleName1Girl: guess.middleName1Girl,
        middleName2Girl: guess.middleName2Girl,
        middleName3Girl: guess.middleName3Girl,
        middleName4Girl: guess.middleName4Girl,
        weightKg: guess.weightKg,
        heightCm: guess.heightCm,
        birthTime: guess.birthTime,
        eyeColor: guess.eyeColor,
        hairColor: guess.hairColor,
        specialMessage: guess.specialMessage,
        submittedAt: guess.submittedAt,
        // Hide email for privacy
      })),
    };
  }

  @Get('check')
  async checkExisting(@Query('name') name: string, @Query('email') email?: string) {
    const existingGuess = await this.guessesService.findByGuesser(name, email);
    return {
      hasGuess: !!existingGuess,
      guess: existingGuess ? {
        submittedAt: existingGuess.submittedAt,
        birthDate: existingGuess.birthDate,
        gender: existingGuess.gender,
      } : null,
    };
  }

  @Get('stats')
  async getStats() {
    const count = await this.guessesService.getGuessCount();
    return {
      totalGuesses: count,
    };
  }
} 