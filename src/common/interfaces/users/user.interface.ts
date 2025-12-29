export interface IUser {
  /**
   * Идентификатор пользователя
   */
  id: string;
  /**
   * Email пользователя
   */
  email: string;
  /**
   * Хешированный пароль пользователя
   */
  password: string;
  /**
   * Дата создания пользователя
   */
  createdAt: Date;
  /**
   * Дата обновления пользователя
   */
  updatedAt: Date;
}
