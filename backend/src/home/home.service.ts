import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, In } from 'typeorm';
import { UserHomeRelation } from './entities/user-home.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(UserHomeRelation)
    private readonly userHomeRepository: Repository<UserHomeRelation>,
    private readonly dataSource: DataSource
  ) {}

  async findByUser(userId: number, page: number = 1, pageSize: number = 50) {
    try {
      const res = await this.userHomeRepository
        .createQueryBuilder('user_home_relation')
        .leftJoinAndSelect('user_home_relation.home', 'home')
        .where('user_home_relation.user_id = :userId', { userId })
        .select([
          'user_home_relation.id',
          'home.id',
          'home.street_address',
          'home.state',
          'home.zip',
          'home.sqft',
          'home.beds',
          'home.baths',
          'home.list_price'
        ])
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const [userHomeRelations, total] = res;

      const homes = userHomeRelations.map(relation => relation.home);

      return { homes, total, page, pageSize };
    } catch (error) {
      console.error("error in findByUser service : ", error);  
      throw error; 
    }
  }

  async updateUsers(homeId: number, newUserIds: number[]): Promise<any> {
    try {
      if(newUserIds.length === 0) {
        throw new BadRequestException('Atleast one user must be selected');
      }

      const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
    
      try {  
        // Fetch current users associated with the home
        const currentUserHomes = await queryRunner.manager.find(UserHomeRelation, {
          where: { home: { id: homeId } },
          relations: ['user'],
        });

        if (!currentUserHomes || currentUserHomes.length === 0) {
          throw new BadRequestException('Home not found');
        }

        const currentUserIds = currentUserHomes.map((userHome) => userHome.user.id);
    
        // Determine which users to add and remove
        const usersToRemove = currentUserIds.filter(userId => !newUserIds.includes(userId));
        const usersToAdd = newUserIds.filter(userId => !currentUserIds.includes(userId));
    
        // Check if there will be no associated users after update
        if (currentUserIds.length === usersToRemove.length && usersToAdd.length === 0) {
          throw new BadRequestException('A home must be associated with at least one user.');
        }
    
        // Remove users from the home
        if (usersToRemove.length > 0) {
          await queryRunner.manager.delete(UserHomeRelation, { home: { id: homeId }, user: { id: In(usersToRemove) } });
        }
    
        // Add new users to the home
        if (usersToAdd.length > 0) {
          const newUserHomeRelations = usersToAdd.map(userId => ({
            home: { id: homeId },
            user: { id: userId },
          }));
          await queryRunner.manager.save(UserHomeRelation, newUserHomeRelations);
        }
    
        await queryRunner.commitTransaction();
        return { success: true };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        if (error instanceof BadRequestException) {
          throw error;
        }
        else {
          throw new InternalServerErrorException('Failed to update users for the home.');
        }
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      if(!(error instanceof BadRequestException)) console.error("error in updateUsers service : ", error);
      throw error;
    }
  }  
}