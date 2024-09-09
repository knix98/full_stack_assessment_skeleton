import { Controller, Get, Query, Put, Body } from '@nestjs/common';
import { HomeService } from './home.service';
import { UpdateUsersDTO } from './dto/update-users.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('find-by-user')
  async findByUser(@Query('userId') userId: number, @Query('page') page: number = 1) {
    try {
      return this.homeService.findByUser(userId, page);
    } catch (error) {
      console.error("error in findByUser controller : ", error);
      throw error;      
    }
  }

  @Put('update-users')
  async updateUsers(@Body() body: UpdateUsersDTO) {
    try {
      return this.homeService.updateUsers(body.homeId, body.userIds);
    } catch (error) {
      console.error("error in updateUsers controller : ", error);
      throw error;
    }
  }
}