import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'user' }) // ✅ Match exact table name
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column('jsonb', { nullable: true })
  history!: Array<{ question: string; answer: string }>;
}