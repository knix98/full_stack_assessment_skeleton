import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { UserHomeRelation } from './entities/user-home.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserHomeRelation])
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
