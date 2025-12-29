import { CreateUserDto, FindOneDto } from '@/common/dto/users';
import { ISafeUser } from '@/common/interfaces/users/safe-user.interface';
import type { IUserService } from '@/common/interfaces/users/users-service.interface';
import { FindOneResponse } from '@/common/responses/users';
import { USERS_CLIENT_TOKEN } from '@/common/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersServiceAdapter implements IUserService {
  constructor(
    @Inject(USERS_CLIENT_TOKEN) private readonly usersClient: ClientProxy,
  ) {}

  async findOne(body: FindOneDto): Promise<FindOneResponse> {
    return firstValueFrom<FindOneResponse>(
      this.usersClient.send('findOne', body),
    );
  }

  async create(body: CreateUserDto): Promise<ISafeUser> {
    return firstValueFrom<ISafeUser>(this.usersClient.send('create', body));
  }
}
