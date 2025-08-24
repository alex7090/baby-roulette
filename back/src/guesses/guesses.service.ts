import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guess } from '../entities/guess.entity';
import { CreateGuessDto } from '../dto/create-guess.dto';

@Injectable()
export class GuessesService {
  constructor(
    @InjectRepository(Guess)
    private guessesRepository: Repository<Guess>,
  ) {}

  async create(createGuessDto: CreateGuessDto): Promise<Guess> {
    // Check if this person already submitted a guess
    const existingGuess = await this.guessesRepository.findOne({
      where: [
        { guesserName: createGuessDto.guesserName },
        ...(createGuessDto.guesserEmail ? [{ guesserEmail: createGuessDto.guesserEmail }] : []),
      ],
    });

    if (existingGuess) {
      throw new ConflictException('You have already submitted a guess! Only one guess per person.');
    }

    const guess = this.guessesRepository.create(createGuessDto);
    return this.guessesRepository.save(guess);
  }

  async findAll(): Promise<Guess[]> {
    return this.guessesRepository.find({
      order: { submittedAt: 'ASC' },
    });
  }

  async findByGuesser(name: string, email?: string): Promise<Guess | null> {
    return this.guessesRepository.findOne({
      where: [
        { guesserName: name },
        ...(email ? [{ guesserEmail: email }] : []),
      ],
    });
  }

  async getGuessCount(): Promise<number> {
    return this.guessesRepository.count();
  }
} 