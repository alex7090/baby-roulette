import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuessesController } from './guesses.controller';
import { GuessesService } from './guesses.service';
import { Guess } from '../entities/guess.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guess])],
  controllers: [GuessesController],
  providers: [GuessesService],
})
export class GuessesModule {} 