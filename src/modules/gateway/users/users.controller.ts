import { CreateUserDto, FindOneDto } from '@/common/dto/users';
import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('findOne')
  async findOne(@Body() body: FindOneDto) {
    return this.usersService.findOne(body);
  }

  @Post('create')
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}
