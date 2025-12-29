import { CreateUserDto, FindOneDto } from '../../dto/users';
import { FindOneResponse, FindOneSafeResponse } from '../../responses/users';
import { ISafeUser } from '../users/safe-user.interface';

export interface IUserService {
  /**
   * Поиск пользователя
   */
  findOne(body: FindOneDto): Promise<FindOneResponse>;

  /**
   * Поиск пользователя без пароля
   */
  findOneSafe(body: FindOneDto): Promise<FindOneSafeResponse>;

  /**
   * Создание нового пользователя
   */
  create(body: CreateUserDto): Promise<ISafeUser>;
}
