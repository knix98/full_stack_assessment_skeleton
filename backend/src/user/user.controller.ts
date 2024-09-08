import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find-all')
  async findAll() {
    return this.userService.findAll();
  }

  @Get('find-by-home/:homeId')
  async findByHome(@Param('homeId') homeId: number) {
    return this.userService.findByHome(homeId);
  }
}