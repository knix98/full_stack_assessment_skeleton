import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find-all')
  async findAll() {
    try {
      return this.userService.findAll();
    } catch (error) {
      console.error("error in findAll controller : ", error);
      throw error;
    }
  }

  @Get('find-by-home/:homeId')
  async findByHome(@Param('homeId') homeId: number) {
    try {
      return this.userService.findByHome(homeId);
    } catch (error) {
      console.error("error in findByHome controller : ", error);
      throw error;
    }
  }
}