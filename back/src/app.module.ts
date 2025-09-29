import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuessesModule } from './guesses/guesses.module';
import { Guess } from './entities/guess.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'baby-roulette.db',
      entities: [Guess],
      synchronize: false,
    }),
    GuessesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
