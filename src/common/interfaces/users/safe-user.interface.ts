import { IUser } from './user.interface';

export type ISafeUser = Omit<IUser, 'password'>;
