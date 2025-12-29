import { CreateUserDto, FindOneDto } from '@/common/dto/users';
import { ISafeUser } from '@/common/interfaces/users/safe-user.interface';
import type { IUserService } from '@/common/interfaces/users/users-service.interface';
import { FindOneResponse, FindOneSafeResponse } from '@/common/responses/users';
import { USER_SERVICE_TOKEN } from '@/common/tokens';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_SERVICE_TOKEN) private readonly userService: IUserService,
  ) {}

  async findOne(body: FindOneDto): Promise<FindOneResponse> {
    return this.userService.findOne(body);
  }

  async findOneSafe(body: FindOneDto): Promise<FindOneSafeResponse> {
    return this.userService.findOneSafe(body);
  }

  async create(body: CreateUserDto): Promise<ISafeUser> {
    return this.userService.create(body);
  }
}
