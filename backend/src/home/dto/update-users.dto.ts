import { IsNumber, IsArray } from 'class-validator';

export class UpdateUsersDTO {
  @IsNumber()
  homeId: number;

  @IsArray()
  userIds: number[];
}