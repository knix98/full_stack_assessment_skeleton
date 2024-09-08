import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { Home } from './entities/home.entity';
import { UserHomeRelation } from './entities/user-home.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Home, UserHomeRelation])
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
