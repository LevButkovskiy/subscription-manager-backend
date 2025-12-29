import { CreateUserDto, FindOneDto } from '@/common/dto/users';
import { ISafeUser } from '@/common/interfaces/users/safe-user.interface';
import type { IUserService } from '@/common/interfaces/users/users-service.interface';
import { sendToMicroservice } from '@/common/lib/rpc-exception-handler';
import { FindOneResponse, FindOneSafeResponse } from '@/common/responses/users';
import { USERS_CLIENT_TOKEN } from '@/common/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersServiceAdapter implements IUserService {
  constructor(
    @Inject(USERS_CLIENT_TOKEN) private readonly usersClient: ClientProxy,
  ) {}

  async findOne(body: FindOneDto): Promise<FindOneResponse> {
    return sendToMicroservice<FindOneResponse>(
      this.usersClient,
      'findOne',
      body,
    );
  }

  async findOneSafe(body: FindOneDto): Promise<FindOneSafeResponse> {
    return sendToMicroservice<FindOneSafeResponse>(
      this.usersClient,
      'findOneSafe',
      body,
    );
  }

  async create(body: CreateUserDto): Promise<ISafeUser> {
    return sendToMicroservice<ISafeUser>(this.usersClient, 'create', body);
  }
}
