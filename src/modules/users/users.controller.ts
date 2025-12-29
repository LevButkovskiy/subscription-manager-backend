import { FindOneDto } from '@/common/dto/users';
import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('findOne')
  async findOne(@Body() body: FindOneDto) {
    return this.usersService.findOne(body);
  }
}
