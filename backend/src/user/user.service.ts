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
    try {
      return this.userRepository.find();
    } catch (error) {
      console.error("error in findAll service : ", error);   
      throw error;   
    }
  }

  async findByHome(homeId: number): Promise<User[]> {
    try {
      return this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user_home_relation', 'uh', 'user.id = uh.user_id')
        .where('uh.home_id = :homeId', { homeId })
        .select([
          'user.id',
          'user.username',
          'user.email',
        ])
        .orderBy('user.username', 'ASC')
        .getMany();
    } catch (error) {
      console.error("error in findByHome service : ", error);
      throw error;      
    }
  }
}