import { LoginDto, RegisterDto } from '@/common/dto/auth';
import { IAuthService } from '@/common/interfaces/auth/auth-service.interface';
import { ISafeUser } from '@/common/interfaces/users/safe-user.interface';
import { AUTH_CLIENT_TOKEN } from '@/common/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthServiceAdapter implements IAuthService {
  constructor(
    @Inject(AUTH_CLIENT_TOKEN) private readonly authClient: ClientProxy,
  ) {}

  async register(body: RegisterDto): Promise<ISafeUser> {
    return firstValueFrom<ISafeUser>(this.authClient.send('register', body));
  }

  async login(body: LoginDto): Promise<ISafeUser> {
    return firstValueFrom<ISafeUser>(this.authClient.send('login', body));
  }
}
