import { RegisterDto } from '../../dto/auth';

export interface IAuthService {
  /**
   * Регистрация нового пользователя
   */
  register(body: RegisterDto): Promise<void>;
}
