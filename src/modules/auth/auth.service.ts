import { RegisterDto } from '@/common/dto/auth';
import { IAuthService } from '@/common/interfaces/auth/auth-service.interface';
import type { IUserService } from '@/common/interfaces/users/users-service.interface';
import { USER_SERVICE_TOKEN } from '@/common/tokens';
import { Inject } from '@nestjs/common';

export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_SERVICE_TOKEN) private readonly userService: IUserService,
  ) {}

  async register(body: RegisterDto): Promise<void> {
    const user = await this.userService.findOne({ email: body.email });
    console.log('user', user);
  }
}
