import { CreateUserDto, FindOneDto } from '@/common/dto/users';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@Request() req: ExpressRequest) {
    const userId = (req.user as { userId: string })?.userId;
    if (!userId) {
      throw new UnauthorizedException('Пользователь не аутентифицирован');
    }
    const user = await this.usersService.findOneSafe({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  @Post('findOne')
  async findOne(@Body() body: FindOneDto) {
    return this.usersService.findOne(body);
  }

  @Post('create')
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}
