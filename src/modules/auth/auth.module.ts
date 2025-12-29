import { USER_SERVICE_TOKEN, USERS_CLIENT_TOKEN } from '@/common/tokens';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersServiceAdapter } from './adapters/users-service.adapter';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import configuration, { TConfiguration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ClientsModule.registerAsync([
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
  providers: [
    AuthService,
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UsersServiceAdapter,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
