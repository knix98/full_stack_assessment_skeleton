import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByHome(homeId: number): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user_home_relation', 'uh', 'user.id = uh.user_id')
      .where('uh.home_id = :homeId', { homeId })
      .getMany();
  }
}