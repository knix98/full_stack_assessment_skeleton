import { Controller, Get, Query, Put, Body } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('find-by-user')
  async findByUser(@Query('userId') userId: number, @Query('page') page: number = 1) {
    return this.homeService.findByUser(userId, page);
  }

  @Put('update-users')
  async updateUsers(@Body() body: { homeId: number; userIds: number[]; version: number }) {
    return this.homeService.updateUsers(body.homeId, body.userIds, body.version);
  }
}