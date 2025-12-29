import {
  AUTH_CLIENT_TOKEN,
  AUTH_SERVICE_TOKEN,
  USER_SERVICE_TOKEN,
  USERS_CLIENT_TOKEN,
} from '@/common/tokens';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthServiceAdapter } from './adapters/auth-service.adapter';
import { UsersServiceAdapter } from './adapters/users-service.adapter';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import configuration, { TConfiguration } from './config/configuration';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
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
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: AuthServiceAdapter,
    },
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UsersServiceAdapter,
    },
  ],
  exports: [],
})
export class GatewayModule {}
