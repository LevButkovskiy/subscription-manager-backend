import { LoginDto, RegisterDto } from '@/common/dto/auth';
import type { IAuthService } from '@/common/interfaces/auth/auth-service.interface';
import { ISafeUser } from '@/common/interfaces/users/safe-user.interface';
import { AUTH_SERVICE_TOKEN } from '@/common/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import type { TConfiguration } from '../config/configuration';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private readonly authService: IAuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<TConfiguration>,
  ) {}

  async register(body: RegisterDto): Promise<ISafeUser> {
    return this.authService.register(body);
  }

  async login(body: LoginDto): Promise<{ user: ISafeUser; token: string }> {
    const user = await this.authService.login(body);
    const expiresIn = this.configService.get<StringValue>('JWT_EXPIRES_IN');

    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        expiresIn,
      },
    );
    return { user, token };
  }
}
