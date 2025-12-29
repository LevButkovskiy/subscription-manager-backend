import { LoginDto, RegisterDto } from '@/common/dto/auth';
import type { IAuthService } from '@/common/interfaces/auth/auth-service.interface';
import { ISafeUser } from '@/common/interfaces/users/safe-user.interface';
import { AUTH_SERVICE_TOKEN } from '@/common/tokens';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private readonly authService: IAuthService,
  ) {}

  async register(body: RegisterDto): Promise<ISafeUser> {
    return this.authService.register(body);
  }

  async login(body: LoginDto): Promise<ISafeUser> {
    return this.authService.login(body);
  }
}
