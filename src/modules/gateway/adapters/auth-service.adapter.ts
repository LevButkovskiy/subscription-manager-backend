import { LoginDto, RegisterDto } from '@/common/dto/auth';
import { IAuthService } from '@/common/interfaces/auth/auth-service.interface';
import { ISafeUser } from '@/common/interfaces/users/safe-user.interface';
import { sendToMicroservice } from '@/common/lib/rpc-exception-handler';
import { AUTH_CLIENT_TOKEN } from '@/common/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthServiceAdapter implements IAuthService {
  constructor(
    @Inject(AUTH_CLIENT_TOKEN) private readonly authClient: ClientProxy,
  ) {}

  async register(body: RegisterDto): Promise<ISafeUser> {
    return sendToMicroservice<ISafeUser>(this.authClient, 'register', body);
  }

  async login(body: LoginDto): Promise<ISafeUser> {
    return sendToMicroservice<ISafeUser>(this.authClient, 'login', body);
  }
}
