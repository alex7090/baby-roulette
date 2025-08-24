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
  gender: string; // 'boy', 'girl', 'surprise'

  @Column({ length: 50, nullable: true })
  firstName: string;

  @Column({ length: 50, nullable: true })
  middleName: string;

  @Column('decimal', { precision: 4, scale: 1 })
  weightPounds: number; // in pounds (e.g., 7.5)

  @Column('integer')
  heightInches: number; // in inches

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