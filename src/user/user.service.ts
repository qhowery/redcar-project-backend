import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    if (!username) {
      throw new Error('Username is required');
    }
    
    return this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'] // Force include password
    });
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } }); // TypeORM example
  }

  // ✅ Accepts username and password as separate arguments
  async create(username: string, password: string) {
    const newUser = this.userRepository.create({
      username,
      password
    });
    return this.userRepository.save(newUser);
  }
}
