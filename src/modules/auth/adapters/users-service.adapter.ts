import { FindOneDto } from '@/common/dto/users';
import type { IUserService } from '@/common/interfaces/users/users-service.interface';
import { FindOneResponse } from '@/common/responses/users';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersServiceAdapter implements IUserService {
  constructor(
    @Inject('USERS_CLIENT') private readonly usersClient: ClientProxy,
  ) {}

  async findOne(body: FindOneDto) {
    return firstValueFrom<FindOneResponse>(
      this.usersClient.send('findOne', body),
    );
  }
}
