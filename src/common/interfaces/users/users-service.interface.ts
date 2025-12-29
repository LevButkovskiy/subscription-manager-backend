import { CreateUserDto, FindOneDto } from '../../dto/users';
import { FindOneResponse } from '../../responses/users';
import { ISafeUser } from '../users/safe-user.interface';

export interface IUserService {
  /**
   * Поиск пользователя
   */
  findOne(body: FindOneDto): Promise<FindOneResponse>;

  /**
   * Создание нового пользователя
   */
  create(body: CreateUserDto): Promise<ISafeUser>;
}
