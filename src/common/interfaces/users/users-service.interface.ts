import { FindOneDto } from '../../dto/users';
import { FindOneResponse } from '../../responses/users';

export interface IUserService {
  /**
   * Поиск пользователя
   */
  findOne(body: FindOneDto): Promise<FindOneResponse>;
}
