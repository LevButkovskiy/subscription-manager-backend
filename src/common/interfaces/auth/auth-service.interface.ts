import { LoginDto, RegisterDto } from '../../dto/auth';
import { ISafeUser } from '../users/safe-user.interface';

export interface IAuthService {
  /**
   * Регистрация нового пользователя
   */
  register(body: RegisterDto): Promise<ISafeUser>;

  /**
   * Вход пользователя в систему
   */
  login(body: LoginDto): Promise<ISafeUser>;
}
