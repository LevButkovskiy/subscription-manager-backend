import { FindOneDto } from '@/common/dto/users';
import { IUserService } from '@/common/interfaces/users/users-service.interface';
import { FindOneResponse } from '@/common/responses/users';
import { Injectable } from '@nestjs/common';
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
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });
    return user;
  }
}
