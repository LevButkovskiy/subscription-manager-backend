import { LoginDto, RegisterDto } from '@/common/dto/auth';
import { IAuthService } from '@/common/interfaces/auth/auth-service.interface';
import { ISafeUser } from '@/common/interfaces/users/safe-user.interface';
import type { IUserService } from '@/common/interfaces/users/users-service.interface';
import { USER_SERVICE_TOKEN } from '@/common/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_SERVICE_TOKEN) private readonly userService: IUserService,
  ) {}

  async register(body: RegisterDto): Promise<ISafeUser> {
    if (body.password !== body.passwordConfirmation) {
      throw new RpcException({
        status: 400,
        message: 'Пароли не совпадают',
      });
    }

    const existingUser = await this.userService.findOne({ email: body.email });
    if (existingUser) {
      throw new RpcException({
        status: 409,
        message: 'Пользователь с таким email уже существует',
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    return await this.userService.create({
      email: body.email,
      password: hashedPassword,
    });
  }

  async login(body: LoginDto): Promise<ISafeUser> {
    const user = await this.userService.findOne({ email: body.email });
    if (!user) {
      throw new RpcException({
        status: 401,
        message: 'Неверный email или пароль',
      });
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new RpcException({
        status: 401,
        message: 'Неверный email или пароль',
      });
    }

    const { id, email, createdAt, updatedAt } = user;
    return { id, email, createdAt, updatedAt };
  }
}
