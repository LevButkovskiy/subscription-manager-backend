import {
  AUTH_CLIENT_TOKEN,
  AUTH_SERVICE_TOKEN,
  USER_SERVICE_TOKEN,
  USERS_CLIENT_TOKEN,
} from '@/common/tokens';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';
import { AuthServiceAdapter } from './adapters/auth-service.adapter';
import { UsersServiceAdapter } from './adapters/users-service.adapter';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import configuration, { TConfiguration } from './config/configuration';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<TConfiguration>) => {
        const jwtSecret = configService.get<string>('JWT_SECRET')!;
        const expiresIn = configService.get<StringValue>('JWT_EXPIRES_IN')!;
        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_CLIENT_TOKEN,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService<TConfiguration>) => ({
          transport: Transport.TCP,
          options: {
            port: configService.get<number>('AUTH_TRANSPORT_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: USERS_CLIENT_TOKEN,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService<TConfiguration>) => ({
          transport: Transport.TCP,
          options: {
            port: configService.get<number>('USERS_TRANSPORT_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: AuthServiceAdapter,
    },
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UsersServiceAdapter,
    },
  ],
  exports: [JwtAuthGuard],
})
export class GatewayModule {}
