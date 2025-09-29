import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('guesses')
export class Guess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  guesserName: string;

  @Column({ length: 200, nullable: true })
  guesserEmail: string;

  @Column('date')
  birthDate: string;

  @Column({ length: 10 })
  gender: string; // 'boy', 'girl'

  @Column({ length: 50, nullable: true })
  firstNameBoy: string;

  @Column({ length: 50, nullable: true })
  middleName1Boy: string;

  @Column({ length: 50, nullable: true })
  middleName2Boy: string;

  @Column({ length: 50, nullable: true })
  middleName3Boy: string;

  @Column({ length: 50, nullable: true })
  middleName4Boy: string;

  @Column({ length: 50, nullable: true })
  firstNameGirl: string;

  @Column({ length: 50, nullable: true })
  middleName1Girl: string;

  @Column({ length: 50, nullable: true })
  middleName2Girl: string;

  @Column({ length: 50, nullable: true })
  middleName3Girl: string;

  @Column({ length: 50, nullable: true })
  middleName4Girl: string;

  @Column('integer')
  weightGrams: number; // in grams (e.g., 3500)

  @Column('integer')
  heightCm: number; // in cm

  @Column('time', { nullable: true })
  birthTime: string; // HH:MM format

  @Column({ length: 50, nullable: true })
  eyeColor: string;

  @Column({ length: 50, nullable: true })
  hairColor: string;

  @Column('text', { nullable: true })
  specialMessage: string;

  @CreateDateColumn()
  submittedAt: Date;
} 