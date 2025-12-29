import { CreateUserDto, FindOneDto } from '@/common/dto/users';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('findOne')
  async findOne(@Query() query: FindOneDto) {
    return this.usersService.findOne(query);
  }

  @Post('create')
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}
