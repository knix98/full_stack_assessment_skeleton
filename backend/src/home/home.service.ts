import { Injectable, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, In } from 'typeorm';
import { Home } from './entities/home.entity';
import { UserHomeRelation } from './entities/user-home.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Home)
    private readonly homeRepository: Repository<Home>,
    @InjectRepository(UserHomeRelation)
    private readonly userHomeRepository: Repository<UserHomeRelation>,
    private readonly dataSource: DataSource
  ) {}

  async findByUser(userId: number, page: number = 1, pageSize: number = 50) {
    const [homes, total] = await this.userHomeRepository
      .createQueryBuilder('user_home_relation')
      .leftJoinAndSelect('user_home_relation.home', 'home')
      .where('user_home_relation.user_id = :userId', { userId })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { homes, total, page, pageSize };
  }

  async updateUsers(homeId: number, newUserIds: number[], version: number): Promise<any> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const home = await queryRunner.manager.findOne(Home, {
        where: { id: homeId },
        lock: { mode: 'optimistic', version },
      });

      if (!home) {
        throw new BadRequestException('Home not found');
      }

      const currentUserHomes = await queryRunner.manager.find(UserHomeRelation, {
        where: { home: { id: homeId } },
        relations: ['user'],
      });
      const currentUserIds = currentUserHomes.map((userHome) => userHome.user.id);

      const usersToRemove = currentUserIds.filter(userId => !newUserIds.includes(userId));
      const usersToAdd = newUserIds.filter(userId => !currentUserIds.includes(userId));

      if (currentUserIds.length === usersToRemove.length && usersToAdd.length === 0) {
        throw new BadRequestException('A home must be associated with at least one user.');
      }

      if (usersToRemove.length > 0) {
        await queryRunner.manager.delete(UserHomeRelation, { home: { id: homeId }, user: { id: In(usersToRemove) } });
      }

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
      if (error.name === 'OptimisticLockVersionMismatchError') {
        throw new ConflictException('The home was updated by another user. Please refresh and try again.');
      }

      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to update users for the home.');
    } finally {
      await queryRunner.release();
    }
  }
}