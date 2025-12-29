import { CreateUserDto, FindOneDto } from '@/common/dto/users';
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

  @MessagePattern('findOneSafe')
  async findOneSafe(@Body() body: FindOneDto) {
    return this.usersService.findOneSafe(body);
  }

  @MessagePattern('create')
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}
