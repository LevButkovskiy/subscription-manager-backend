import { CreateUserDto, FindOneDto } from '@/common/dto/users';
import { ISafeUser } from '@/common/interfaces/users/safe-user.interface';
import { IUserService } from '@/common/interfaces/users/users-service.interface';
import { FindOneResponse, FindOneSafeResponse } from '@/common/responses/users';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(body: FindOneDto): Promise<FindOneResponse> {
    if (!body.id && !body.email) {
      throw new RpcException({
        status: 400,
        message: 'Необходимо указать id или email',
      });
    }

    const where: Partial<UserEntity> = {};

    if (body.id) {
      where.id = body.id;
    } else if (body.email) {
      where.email = body.email;
    }

    const user = await this.userRepository.findOne({
      where,
    });
    return user;
  }

  async findOneSafe(body: FindOneDto): Promise<FindOneSafeResponse> {
    const user = await this.findOne(body);
    if (!user) {
      return null;
    }
    const { id, email, createdAt, updatedAt } = user;
    return { id, email, createdAt, updatedAt };
  }

  async create(body: CreateUserDto): Promise<ISafeUser> {
    const user = this.userRepository.create({
      email: body.email,
      password: body.password,
    });
    const savedUser = await this.userRepository.save(user);

    const { id, email, createdAt, updatedAt } = savedUser;
    return { id, email, createdAt, updatedAt };
  }
}
